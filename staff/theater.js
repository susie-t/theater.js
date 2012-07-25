jQuery.noConflict();
Theater = Object.extend(Class.create(), Theater);
Theater.prototype = {
  initialize: function(options){
    this.version = "3.0.0";
    
    this.options = {
      imgId: 'img',
      frameId: 'frame',
      msgId: 'msg',
      playId: 'play',
      resetId: 'reset',
      name: 'Theater',
      imgs: {},
      scenario: [],
      filter: "",
      playInterval: 1000,
      typeInterval: 100,
      transTime: 1,
      isAuto: false,
      interlude: null,
      curtain: null,
      blank: Theater.Constructor.path + "blank.gif",
      adjust: Theater.PhotoFrame.adjusts.ADJUST
    };
    
    Object.extend(this.options, options);
    if(this.options.img){
      this.options.imgs = this.options.img;
    }
    this.imgs = this.options.imgs;
    if(this.options.curtain){
      this.imgs.curtain = this.options.curtain;
    }
    
    this.currents = [];
    this.result = null;
    this.isPlay = true;
    this.isManual = true;
    this.isActing = false;
    this.isAutoAll = false;
    this.isKeep = false;
    this.loopCount = 0;
    
    this.typist = new Theater.Typist({name:this.options.name + 'Typist'});
    this.photoFrame = new Theater.PhotoFrame({
      name: this.options.name + 'PhotoFrame',
      frame: this.options.frameId,
      imgs: this.options.imgs,
      interlude: this.options.interlude,
      curtain: this.options.curtain,
      blank: this.options.blank,
      width: this.options.width,
      height: this.options.height,
      left: this.options.left,
      top: this.options.top,
      adjust: this.options.adjust
    });
    
    this.mainScenario = this.options.scenario;
    this.reset();
    
    var _onload = function(){
      
      this.frameElem = $(this.options.frameId);
      this.msgElem = $(this.options.msgId);
      this.playElem = $(this.options.playId);
      this.resetElem = $(this.options.resetId);
      
      Event.observe(this.playElem, 'click', function(){
        this.manual();
      }.bind(this));
      
      if(this.resetElem){
        Event.observe(this.resetElem, 'click', function(){
          this.confirmReset();
        }.bind(this));
      }
      
      if(this.playElem.type == 'button'){
        this.focusElem = this.playElem;
      }else{
        try{
          var focusId = this.options.playId + '_dummy';
          new Insertion.Bottom(this.playElem, 
            "<button id='" + focusId + "' style='height:0px;width:0px;position:absolute;"
            + "top:0px;left:0px;border-style:none;z-index:1000;'></button>");
          this.focusElem = $(focusId);
        }catch(e){}
      }
      this.focus();
    
    }.bind(this);
    
    if(document.body){
      _onload();
    }else{
      Event.observe(window, 'load', _onload);
    }
  },
  
  work: {},
  
  getImg: function(){
    return $A(arguments).inject(this.imgs, function(imgs, name){
      if(!imgs) return null;
      return imgs[name];
    });
  },
  
  preload: function(imgs){
    if(typeof imgs == "string") imgs = [imgs];
    if(!(imgs instanceof Array)){
      Object.extend(this.imgs, imgs);
    }
    this.photoFrame.preload(imgs);
    return imgs;
  },

  getImgElem: function(){
    return this.photoFrame.img;
  },

  focus: function(){
    if(typeof _IG_Prefs != "undefined") return;
    try{
      if(this.focusElem){
        if(this.focusElem != this.playElem){
          Theater.Util.positionWinUpLeft(this.focusElem);
        }
        this.focusElem.focus();
      }
    }catch(e){}
  },
  
  push: function(scenario, label){
    if(!(scenario instanceof Array)){
      scenario = [scenario];
    }
    this.currents.push({
      scenario: scenario,
      index: 0,
      retakeParent: false,
      label: label
    });
  },
  
  insert: function(scenario){
    this.push(scenario);
  },
  
  setRetakeParent: function(bln){
    var current = this.getCurrent();
    if(!current) return;
    current.retakeParent = bln;
  },

  setManual: function(bln){
    this.isManual = bln;
  },

  manual: function(index){
    if(this.isManual){
      this.play(index);
    }
  },

  play: function(index){
    Theater.Timer.clearTimeout(this.options.name);
    this.focus();
    if(!this.isPlay){
      return;
    }
    if(!this.typist.isEnd){
      this.typist.typeAll();
      return;
    }
    this.isActing = false;
    var current = this.getCurrent();
    if(!current) return;
    if(index != null) current.index = index;
    if(current.index >= current.scenario.length){
      this.currents.pop();
      if(current.retakeParent){
        this.play(0);
      }else{
        this.play();
      }
    }else{
      var obj = current.scenario[current.index];
      if(obj instanceof Function){
        this.result = current.scenario[current.index++].bind(this)(this.result);
      }else if(obj instanceof Array){
        this.act({
          img: obj[0],
          msg: obj[1]
        });
        this.result = null;
        current.index++;
      }else{
        current.index++;
        var hash = $HH(obj);
        if(hash.size() == 1){
          var key = (hash.keys())[0];
          var value = (hash.values())[0];
          switch(key){
            case "act":
            case "alert":
            case "confirm":
            case "choice":
            case "keep":
            case "playCold":
              this[key](value);
              break;
            case "push":
            case "retake":
            case "retakeParent":
            case "skip":
            //case "repeat":
            case "back":
            case "reset":
            case "setManual":
            case "read":
              this[key](value);
              this.keep();
              break;
            case "loop":
              this[key].apply(this, value);
              this.keep();
              break;
            case "prompt":
              if(!(value instanceof Array)) value = [value];
              this[key].apply(this, value);
              this.result = null;
              break;
            case "labelPush":
              var valueHash = $HH(value);
              this.push(valueHash.values()[0], valueHash.keys()[0]);
              this.keep();
              break;
            case "labelLoop":
              var valueHash = $HH(value[1]);
              this.loop(value[0], valueHash.values()[0], valueHash.keys()[0]);
              this.keep();
              break;
            case "branch":
              var scenario = value[this.result];
              if(scenario == null){
                scenario = value["$default"] || value["default"]
                  || function(result){this.keep();return result;};
              }
              this.push(scenario);
              this.keep();
              break;
            case "setVal":
              var ary = ($HH(value).keys()[0] || "").split("\.");
              var val = $HH(value).values()[0];
              this.result = this.setVal(ary, val);
              this.keep();
              break;
            case "delVal":
              var ary = value.split("\.");
              this.result = this.delVal.apply(this, ary);
              this.keep();
              break;
            case "saveResult":
              var ary = value.split("\.");
              this.result = this.setVal(ary, this.result);
              this.keep();
              break;
            case "setResult":
              this.keep();
              this.result = this.translate(value);
              break;
            case "succ":
              var name, num;
              if(typeof value != "object"){
                name = value;
                num = 1;
              }else{
                var valueHash = $HH(value);
                name = valueHash.keys()[0];
                num = valueHash.values()[0];
              }
              var val = this.getVal(name);
              if(typeof val == "number"){
                this.result = this.setVal(name, val + num);
              }
              this.keep();
              break;
            case "check": case "=":
              key = "==";
            case "==": case "!=": case "===": case "!==":
            case ">":  case ">=": case "<":   case "<=":
              var valueHash = $HH(value);
              var name = valueHash.keys()[0];
              var wk = this.getVal(name);
              var val = valueHash.values()[0];
              this.result = function(){
                switch(key){
                  case "==" : return wk ==  val;
                  case "!=" : return wk !=  val;
                  case "===": return wk === val;
                  case "!==": return wk !== val;
                  case ">"  : return wk >   val;
                  case ">=" : return wk >=  val;
                  case "<"  : return wk <   val;
                  case "<=" : return wk <=  val;
                }
              }();
              this.keep();
              break;
            default:
              this.act(obj);
              this.result = null;
          }
        }else{
          this.act(obj);
          this.result = null;
        }
      }
      if(this.isKeep){
        this.isKeep = false;
        this.play();
      }
    }
    if(this.isAutoAll && this.options.isAuto && !this.isActing){
      Theater.Timer.setTimeout(
        this.options.name,
        this.play.bind(this),
        this.options.playInterval,
        true
      );
    }
  },
  
  setResult: function(result){
    this.result = result;
  },

  getResult: function(result){
    return this.result;
  },
  
  keep: function(){
    this.isKeep = true;
  },

  retake: function(label){
    var current = this.getCurrent(label);
    if(!current) return;
    current.index = 0;
  },

  retakeParent: function(){
    this.setRetakeParent(true);
    this.skip();
  },
  
  reset:function(){
    this.currents.clear();
    this.push(this.mainScenario);
  },

  confirmReset: function(){
    if(!this.isPlay){
      return;
    }
    if(!this.typist.isEnd){
      this.typist.typeAll();
    }
    this.push([
      function(){
        this.confirm('はじめに戻ります。<br/>よろしいですか？');
      },
      function(result){
        if(result){
          if(this.options.curtain != null){
            this.act({
              img: this.options.curtain,
              filter: '',
              inEffect: '',
              outEffect: '',
              adjust: Theater.PhotoFrame.adjusts.FULL,
              isAuto: false
            });
          }
          this.reset();
          this.keep();
        }
      }
    ]);
    //this.keep();
    this.play();
  },
  
  skip: function(label){
    var current = this.getCurrent(label);
    if(!current) return;
    current.index = current.scenario.length;
  },

  jump: function(index){
    var current = this.getCurrent();
    if(!current) return;
    if(index < 0 || index >= current.scenario.length) return;
    current.index = index;
  },
  
  move: function(diff){
    var current = this.getCurrent();
    if(!current) return;
    var index = current.index + diff;
    if(index < 0 || index >= current.scenario.length) return;
    current.index = index;
  },

  repeat: function(){
    this.move(-1);
  },
  
  back: function(){
    this.move(-2);
  },
  
  quit: function(){
    this.currents.clear();
  },
  
  end: function(){
    this.puit();
  },
  
  fin: function(){
    this.puit();
  },
  
  getCurrent: function(label){
    if(this.currents.length == 0) return null;
    if(!label){
      return this.currents.last();
    }else{
      while(true){
        var current = this.currents.last();
        if(current.label == label) return current;
        this.currents.pop();
        if(this.currents.length == 0) return null;
      }
    }
  },

  translate: function(str, isEsc){
    if(typeof str != "string") return str;
    return str.replace(/(\$|\$I(?:MG)?|\$R(?:ESULT)?|\$L(?:OOP)?C(?:OUNT)?)\{([^}]*)\}/g, function(){
      var args = arguments;
      if(args[2] == null) return args[0];
      var value = null;
      switch(args[1]){
        case "$":
          var ary = args[2].split("\.");
          var value = this.getVal.apply(this, ary);
          return (isEsc && value.escapeHTML) ? value.escapeHTML() : value;
          break;
        case "$R":
        case "$REUSLT":
          return (isEsc && this.result.escapeHTML) ? this.result.escapeHTML() : this.result;
          break;
        case "$I":
        case "$IMG":
          var ary = args[2].split("\.");
          return this.getImg.apply(this, ary);
          break;
        case "$LC":
        case "$LOOPCOUNT":
          return this.loopCount + parseInt(args[2] || 1);
          break;
        default:alert(args[1]);
          return args[0];
      }
    }.bind(this));
  },

  _act: function(options){
    if(options.img) $(this.options.imgId).src = options.img;
    if(options.msg) $(this.options.msgId).innerHTML = options.msg;
  },
  
  act: function(options){
    if(options instanceof Array){
      var sub = options.inject([], function(_sub, _options, index){
        if(index == 0) return _sub;
        var func = (function(__options){
          return function(){
            this.act(__options);
          };
        })(_options);
        _sub.push(func);
        return _sub;
      });
      this.act(options[0]);
      this.push(sub);
      return;
    }
    var hash = $HH(options);
    var value = hash.values()[0];
    if(hash.size() == 1 && value instanceof Array){
      switch(hash.keys()[0]){
        case 'img':
          this.appear(value);
          return;
        case 'msg':
          this.speak(value);
          return;
      }
    }
    this.isActing = true;
    if(options.img != null){
      var _options = Theater.Util.selectOptions([options, this.options],  [
        'filter', 'time', 'adjust', 'height', 'width', 'effect',
        'top', 'left', 'isDraggable', 'outEffect', 'inEffect'
      ]);
      _options.src = this.translate(options.img);
      this.photoFrame.show(_options);
    }
    var auto = [
      this.options.name,
      this.play.bind(this),
      options.playInterval || this.options.playInterval,
      true      
    ];
    if(options.msg != null){
      this.typist.type({
        text: this.translate(options.msg, true),
        paper: options.msgId || this.msgElem,
        auto: (options.isAuto || this.options.isAuto) ? auto : null,
        interval: options.typeInterval || this.options.typeInterval,
        isTypeAll: options.isTypeAll || this.options.isTypeAll
      });
    }else{
      if(options.isAuto || this.options.isAuto){
        Theater.Timer.setTimeout.apply(Theater.Timer, auto);
      }
    }
  },
  
  speak: function(msg){
    if(msg instanceof Array){
      var sub = msg.inject([], function(_sub, _msg, index){
        if(index == 0) return _sub;
        var func = (function(__msg){
          return function(){
            this.speak(__msg);
          };
        })(_msg);
        _sub.push(func);
        return _sub;
      });
      this.speak(msg[0]);
      this.push(sub);
      return;
    }
    this.isActing = true;
    var auto = [
      this.options.name,
      this.play.bind(this),
      this.options.playInterval,
      true      
    ];
    this.typist.type({
      text: this.translate(msg, true),
      paper: this.msgElem,
      auto: (this.options.isAuto) ? auto : null,
      interval: this.options.typeInterval
    });
  },
  
  appear: function(img){
    if(img instanceof Array){
      var sub = img.inject([], function(_sub, _img, index){
        if(index == 0) return _sub;
        var func = (function(__img){
          return function(){
            this.appear(__img);
          };
        })(_img);
        _sub.push(func);
        return _sub;
      });
      this.appear(img[0]);
      this.push(sub);
      return;
    }
    var _options = Theater.Util.selectOptions([this.options], [
      'filter', 'time', 'adjust', 'height', 'width',
      'top', 'left', 'isDraggable', 'outEffect', 'inEffect'
    ]);
    _options.src = this.translate(img);
    this.photoFrame.show(_options);
  },
  
  menu: function (options){
    this.isPlay = false;
    var bkpFocus = (this.focusElem) ? this.focusElem.tabIndex : null;
    if(this.focusElem) this.focusElem.tabIndex = '-1';
    var bkpReset = (this.resetElem) ? this.resetElem.tabIndex : null;
    if(this.resetElem) this.resetElem.tabIndex = '-1';
    new Theater.Menu({
      outer: options.outer || this.frameElem,
      contents: this.translate(options.contents, true),
      actions: options.actions,
      onCloseAll: function(){
        this.isPlay = true;
        if(this.focusElem) this.focusElem.tabIndex = bkpFocus;
        if(this.resetElem) this.resetElem.tabIndex = bkpReset;
        this.play();
      }.bind(this),
      focusName: this.translate(options.focusName),
      title: this.translate(options.title, true)
    });
  },
  
  prompt: function(msg, value){
    if(value == null) value = "";
    var _theater = this;
    msg = msg ? msg + "<br/>" : "";
    this.menu({
      contents: msg
              + "<input type='text' name='IN' value='" + this.translate(value).replace(/\'/g, "\\'") + "'/><br/>"
              + "<button name='btn' class='menu-contents-control'>入力<\/button>",
      actions: {
        'btn': function(menu){
          _theater.setResult(this.form.IN.value);
          menu.close();
        }
      },
      focusName: 'IN',
      title: "入力"
    });
  },
  
  confirm: function(msg){
    var _theater = this;
    msg = msg ? msg + "<br/>" : "";
    this.menu({
      contents: msg
        + "<button name='yes' class='menu-contents-control'>はい<\/button>"
        + "<button name='no' class='menu-contents-control'>いいえ<\/button>",
      actions: {
        'yes': function(menu){
          _theater.setResult(true);
          menu.close();
        },
        'no': function(menu){
          _theater.setResult(false);
          menu.close();
        }
      },
      title: "確認"
    });
  },
  
  alert: function(msg){
    msg = msg ? msg + "<br/>" : "";
    this.menu({
      contents: msg
        + "<button name='btn' class='menu-contents-control'>OK<\/button>",
      actions: {
        'btn': function(menu){
          menu.close();
        }
      },
      title: "確認"
    });    
  },
  
  choice: function(choices){
    var _theater = this;
    if(!(choices instanceof Array)){
      choices = $HH(choices);
    }
    var contents = choices.inject("", function(memo, elm){
      var key, value;
      if(elm.key){
        key = elm.key;
        value = elm.value;
      }else{
        key = value = elm;
      }
      return memo + "<button name='" + key + "' class='menu-contents-control'"
      + " value='" + key + "' style='width:90%;'>" + value + "<\/button><br/>";
    });
    var actions = choices.inject({}, function(memo, elm){
      var key, value;
      if(elm.key){
        key = elm.key;
        value = elm.value;
      }else{
        key = value = elm;
      }
      memo[key] = function(menu){
        _theater.setResult(key);
        menu.close();
      };
      return memo;
    });
    this.menu({
      contents: contents,
      actions: actions,
      title: "選択"
    });
  },
  
  form: function(form){
    var _theater = this;
    this.menu({
      contents: form + "<br/>"
              + "<button name='btn' class='menu-contents-control'>入 力<\/button>"
              + "<button class='menu-contents-control' onclick='this.form.reset();'>リセット<\/button>",
      actions: {
        'btn': function(menu){
          var result = Form.getElements(this.form).inject({}, function(memo, elm){
            if(!(elm.name in memo)){
              memo[elm.name] = elm.value;
            }else{
              if(!(memo[elm.name] instanceof Array)){
                memo[elm.name] = [memo[elm.name]];
              }
              memo[elm.name].add(elm.value);
            }
            return memo;
          });
          _theater.setResult(result);
          menu.close();
        }
      },
      title: "入力"
    });
  },
  
  preload: function(imgs){
    this.photoFrame.preload(imgs);
  },
  
  setVal: function(key, value){
    value = this.translate(value);
    if(key instanceof Array){
      var last = key.pop();
      var object = key.inject(this.work, function(work, _key){
        if(!work[_key]) work[_key] = {};
        return work[_key];
      });
      object[last] = value;
    }else{
      this.work[key] = value;
    }
    return value;
  },
  
  getVal: function(){
    return $A(arguments).inject(this.work, function(work, _key){
      if(!work) return null;
      return work[_key];
    });
  },
  
  delVal: function(){
    var ary = $A(arguments);
    var last = ary.pop();
    var ret = null;
    var object = $A(arguments).inject(this.work, function(work, _key){
      if(!work) work = {};
      return work[_key];
    });
    if(object != null && object[last] != null){
      ret = object[last];
      delete object[last];
    }
    return ret;
  },
  
  effect: function(){
    var img = this.photoFrame.img;
    //var _arguments = $A(arguments);
    //img.visualEffect.apply(img, _arguments);
    //jQuery(img).show(inEffect, inOption);
    Theater.Util.show(img, inEffect, inOption);
  },
  
  read: function(scenario, charset, isF){
    Theater.Constructor.include(this.translate(scenario), charset, isF);
  },
  
  playCold: function(){
    this.isPlay = false;
    var _playCold_count = 0;
    var _playCold_progress = this.photoFrame.progress;
    if(this.photoFrame.tid) clearInterval(this.photoFrame.tid);
    var _playCold_func = function(){
      if(_playCold_count > 100){
        this.act({
          msg:"タイムアウト<br/>シナリオが見つかりません。",
          isTypeAll:true				
        });
        return;
      }
      var _playCold_scenario = undefined;
      try{
        eval("_playCold_scenario = " + this.translate(arguments[0]) + ";");
      }catch(e){}
      if(_playCold_scenario == undefined){
      _playCold_progress.innerHTML = "SCENARIO LOADING...";
      Element.setStyle(_playCold_progress, {visibility:'visible'});
        _playCold_count++;
        setTimeout(_playCold_func.bind(this, arguments[0]), 1000);
    }else{
      Element.setStyle(_playCold_progress, {visibility:'hidden'});
      _playCold_progress.innerHTML = '';
        this.push(_playCold_scenario);
        this.isPlay = true;
        this.play();
      }
    }.bind(this);
    setTimeout(_playCold_func.bind(this, arguments[0]), 0);
  },

  loop: function(condition, scenario, label){
    label = label || "LOOP";
    var init, keep, each;
    var count = this.loopCount = 0;
    if(condition instanceof Array){
      init = condition[0].bind(this) || Prototype.emptyFunction;
      keep = condition[1].bind(this) || Prototype.K;
      each = condition[2].bind(this) || Prototype.emptyFunction;
    }else if(typeof(condition) == 'number'){
      init = Prototype.emptyFunction;
      keep = function(){return (count < condition);};
      each = Prototype.emptyFunction;	
    }else if(typeof(condition) == 'boolean'){
      init = Prototype.emptyFunction;
      keep = function(){return condition;};
      each = Prototype.emptyFunction;	
    }else{
      init = Prototype.emptyFunction;
      keep = Prototype.emptyFunction;
      each = Prototype.emptyFunction;
    }
    var iniFlg = true;
    init();
    this.push([
      function(result){
        if(!iniFlg){
          each(result);
          this.loopCount = ++count;
        }
        iniFlg = false;
        if(!keep(result)){
          this.skip();
        }
        this.keep();
        return result;
      },
      function(result){
        this.push(scenario);
        this.keep();
        return result;
      },
      function(result){
        this.retake();
        this.keep();
        return result;
      }
    ], label);
  }
};

Theater.Timer = {
  timeouts: {},
  setTimeout: function (id, func, time, isReset){
    var _func = function(){
      func();
      delete this.timeouts[id];
    }.bind(this);
    if(isReset == null || isReset == true){
      if(this.timeouts[id] != null){
        this.clearTimeout(id);
      }
      this.timeouts[id] = window.setTimeout(_func, time);
    }else{
      if(this.timeouts[id] == null){
        this.timeouts[id] = window.setTimeout(_func, time);
      }
    }
    return id;
  },

  clearTimeout: function (id){
    if(this.timeouts[id] != null){
      window.clearTimeout(this.timeouts[id]);
      delete this.timeouts[id];
    }
  }  
};

Theater.Typist = Class.create();
Theater.Typist.prototype = {
  initialize: function(options){
    this.options = {
      name : 'Typist',
      paper : null,
      auto : null,
      method : this.methods.TYPE_SCROLL,
      isHTML : true,
      interval : 100,
      endMark : "&nbsp;▼",
      lastMark : "&nbsp;",
      overflow : 'auto',
      isBlock : false
    };
    Object.extend(this.options, options);
    this.isEnd = true;
    this.brName = '_Typist_br';
  },
  
  methods:{NOT_TYPE:0, TYPE_NOT_SCROLL:1, TYPE_SCROLL:2},

  type: function (options){

    var isEnd = false;
        
    Theater.Timer.clearTimeout(this.options.name);

    var _options = {};
    if(options){
      _options = Theater.Util.selectOptions([options, this.options], [
        'auto', 'method', 'isTypeAll', 'isHTML',
        'interval', 'lastMark', 'endMark', 'isBlock'
      ]);
      _options.paper = $(options.paper) || $(this.options.paper);
      _options.text = options.text;

    }
    
    if(_options.text != null){
      if(_options.method != null){
        if(isNaN(_options.method)){
          this.method = this.methods[_options.method];
        }else{
          this.method = _options.method;
        }
      }

      Object.extend(this, _options);

      this.isEnd = false;
      
      if(!this.isBlock){
        if(this.line == null && this.lineLast == null){
          this.paper.innerHTML = "";
          var str = "<span id='" + this.paper.id + "_line'"
            + " style='padding:0px;margin:0px;word-break:brek-all;text-align:left;'></span>"
            + "<span id='" + this.paper.id + "_lineLast'"
            + " style='padding:0px;margin:0px;'></span>";
          new Insertion.Top(this.paper, str);
          this.line = $(this.paper.id + "_line");
          this.lineLast = $(this.paper.id + "_lineLast");
          if(this.options.overflow != null){
            Element.setStyle(this.paper, {overflow:this.options.overflow});
          }
        }
        this.line.innerHTML = "";
        this.lineLast.innerHTML = this.lastMark;
      }else{
        this.line = this.paper;
      }
      this.textNodes = [];      
      if(this.isHTML){
        if(this.method != this.methods.NOT_TYPE){
          var div = document.createElement('div');
          div.innerHTML = this.text.replace(/<br\/?>/ig, "<span name='" + this.brName + "'></span>");
          this.fragment = $A(div.childNodes);
          this.textNodes = this.initTextNodes(this.textNodes, this.fragment);
          var div = document.createElement('div');
          div.innerHTML = this.text;
          this.fragmentAll = $A(div.childNodes);
          this.fragment.each(function(node){
            this.line.appendChild(node);
          }.bind(this));
        }else{
          _options.isTypeAll = true; 
        }
      }else{
        if(this.method == this.methods.NOT_TYPE){
          this.line.innerHTML = "&nbsp;"
          _options.isTypeAll = true;  
        }
      }
    }

    if(_options.isTypeAll){
      if(this.isHTML){
        this.line.innerHTML = this.text;
        delete this.textNode;
      }else{
        this.line.firstChild.nodeValue = this.text;
      }
      isEnd = true;
    }else{
      if(this.isHTML){
        while(true){
          if(this.textNode == null && this.textNodes.length > 0){
            this.textNode = this.textNodes.shift();
          }
          if(this.textNode == null){
            isEnd = true;
            break;
          }
          
          if(this.textNode.node.nodeType == 1
          && this.textNode.node.getAttribute('name')  == this.brName){
            this.textNode.node.innerHTML = this.textNode.value;
            delete this.textNode;
          }else{
            var length;
            try{
              length = this.textNode.node.nodeValue.length;
            }catch(e){
              //console.info("nodeValue not found");
              delete this.textNode;
              continue;              
            }
            if(this.textNode.value.length == length){
              delete this.textNode;
              continue;
            }
            if(!this.isEnd){
              this.textNode.node.nodeValue = this.textNode.value.substr(0, length.succ());
            }else{
              delete this.textNode;
            }
          }
          break;
        }
      }else{
        var length;
        if(this.line.innerHTML == ""){
          this.line.innerHTML = "&nbsp;"
          length = 0;
        }else{
          length = this.line.firstChild.nodeValue.length;
        }
        if(this.text.length == length){
          isEnd = true;
        }else{
          if(!this.isEnd){
            this.line.firstChild.nodeValue = this.text.substr(0, length.succ());
          }
        }
      }
    }
    
    var scrollToLineLast = function(){
      if(!this.isBlock
      && this.lineLast.scrollIntoView != null
      && this.method == this.methods.TYPE_SCROLL){
        this.paper.scrollTop = this.lineLast.offsetTop;
      }
    }.bind(this);  

    if(!isEnd && !this.isEnd){
      scrollToLineLast();
      Theater.Timer.setTimeout(this.options.name, (function(){this.type();}).bind(this), this.interval);
    }else{
      if(!this.isBlock){
        this.lineLast.innerHTML = this.options.endMark;
      }
      scrollToLineLast();
      this.isEnd = true;
      if(this.auto != null){
        Theater.Timer.setTimeout.apply(Theater.Timer, this.auto);
      }
    }
  },
  
  initTextNodes: function(textNodes, fragment){
    return fragment.inject(textNodes, function(memo, node){
      switch(node.nodeType){
        case 3:
          var value = node.nodeValue;
          node.nodeValue = "";
          memo.push({
            'node'  : node,
            'value' : value
          });
          return memo;
          
        case 1:

        default:
          if(node.tagName.toUpperCase() == 'SPAN' 
          && node.getAttribute('name') == this.brName){
            memo.push({
              'node'  : node,
              'value' : "<br/>"
            });
            return memo;
          }
          return this.initTextNodes(memo, $A(node.childNodes));      
      
      }
    }.bind(this));
  },
  
  typeAll: function(){
    this.type({isTypeAll:true});
  }
  
};

Theater.ImageChanger = Class.create();
Object.extend(Theater.ImageChanger, {
  filters: [
    "Barn(",                            /* 100 */                             
    "Barn(orientation=horizontal,",     /* 101 */
    "Blinds(",                          /* 102 */
    "Blinds(direction=right,",          /* 103 */
    "CheckerBoard(direction=down,",     /* 104 */
    "CheckerBoard(",                    /* 105 */
    "Fade(",                            /* 106 */
    "GradientWipe(",                    /* 107 */
    "Inset(",                           /* 108 */
    "Iris(",                            /* 109 */
    "Iris(irisStyle=DIAMOND,",          /* 110 */
    "Iris(irisStyle=CIRCLE,",           /* 111 */
    "Iris(irisStyle=CROSS,",            /* 112 */
    "Iris(irisStyle=SQUARE,",           /* 113 */
    "Iris(irisStyle=STAR,",             /* 114 */
    "Pixelate(",                        /* 115 */
    "RadialWipe(",                      /* 116 */
    "RadialWipe(wipeStyle=WEDGE,",      /* 117 */
    "RadialWipe(wipeStyle=RADIAL,",     /* 118 */
    "RandomBars(",                      /* 119 */
    "RandomBars(orientation=vertical,", /* 120 */
    "RandomDissolve(",                  /* 121 */
    "Slide(",                           /* 122 */
    "Slide(slideStyle=PUSH,",           /* 123 */
    "Slide(slideStyle=SWAP,",           /* 124 */
    "Spiral(",                          /* 125 */
    "Stretch(",                         /* 126 */
    "Stretch(stretchStyle=HIDE,",       /* 127 */
    "Stretch(stretchStyle=PUSH,",       /* 128 */
    "Strips(",                          /* 129 */
    "Strips(motion=leftup,",            /* 130 */
    "Strips(motion=rightdown,",         /* 131 */
    "Strips(motion=rightup,",           /* 132 */
    "Wheel(spokes=8,",                  /* 133 */
    "Zigzag("                           /* 134 */
  ],
  
  getFilter: function(options){
    var no, time, other;
    if(!isNaN(options)){
      no = options;
      time = 1;
      other = "";
    }else{
      no = options.no || 0;
      time = options.time || 1;
      other = options.other || "";
    }
    if(no >= 0 && no <= 23){
      return "; filter: revealTrans(Transition=" + no + ","
        + "Duration=" + time + ") " + other + ";";
    }else if(no >= 100 && no <= 134){
      return "; filter: progid:DXImageTransform.Microsoft."
        + this.filters[no - 100] + "Duration=" + time + ") " + other + ";";
    }else{
      return "";
    }
  }
});
Theater.ImageChanger.prototype = {
  initialize: function(options){
    var _onload = function(){
      this.img = $(options.img);
    }.bind(this);
    if(document.body){
      _onload();
    }else{
      Event.observe(window, 'load', _onload);
    }
    if(options.interlude){
      this.interlude = options.interlude;
      new Image().src = this.interlude;
    }else{
      this.interlude = Theater.ImageChanger.interlude;
    }
  },

  change: function (options) {
    var img = this.img;
    if(!img) return;
    var id = img.id || 'ImageChanger';
    var timerEffect = id + '_effect';
    var timerLoading = id + '_loading';
    Theater.Timer.clearTimeout(timerEffect);
    Theater.Timer.clearTimeout(timerLoading);
    var next = new Image();
    next.onload = Prototype.emptyFunction;
    var src = options.src;
    next.src = src; 
    var filter = null;;
    if(options.filter != null) filter = options.filter;
    else if(options.effect != null) filter = options.filter;
    if(!isNaN(parseInt(filter))){
      filter = Theater.ImageChanger.getFilter(filter);
    }
    var trans = null;
    var interlude = this.interlude;
    if(options.interlude){
      interlude = options.interlude;
      new Image().src = interlude;
    }
    if(img.filters){
      if(filter != null){
        Element.setStyle(img, {filter:filter});
      }
      if(img.filters.revealTrans != null){
        trans = img.filters.revealTrans;
      }else{
        for(var i in img.filters){
          if(i.match(/DXImageTransform\.Microsoft/i)){
            trans = img.filters[i];
            break;
          }
        }
      }
    }
    var outEffect = options.outEffect || (options.effect||[])[1];
    var inEffect  = options.inEffect  || (options.effect||[])[2];
    if(trans){
      //img.visualEffect('Appear', {transition:Effect.Transitions.full});
      jQuery(img).fadeIn();
      if(img.complete){
        Element.setStyle(img, options.style);
        trans.apply();
        img.src = src;
        trans.play();
      }else{
        Element.setStyle(img, options.style);
        img.src = src;
      }
    }else if(outEffect || inEffect){
      var outOption, inOption;
      if(outEffect){
        if(outEffect instanceof Array){
          outOption = outEffect[1];
          outEffect = outEffect[0];
        }else{
          outOption = {};
          outEffect = outEffect;
        }
      }else{
        outOption = {transition:Effect.Transitions.full};
        outEffect = "Fade";
      }
      if(inEffect){
        if(inEffect instanceof Array){
          inOption = inEffect[1];
          inEffect = inEffect[0];
        }else{
          inOption = {};
          inEffect = inEffect;
        }
      }else{
        inOption = {transition:Effect.Transitions.full};
        inEffect = "Appear";
      }
      //img.visualEffect(outEffect, outOption);
      //jQuery(img).hide(outEffect, outOption);
      Theater.Util.hide(img, outEffect, outOption);
      Theater.Timer.setTimeout(timerEffect, function(){
        next.onload = Prototype.emptyFunction;
        Element.setStyle(img, options.style);
        img.src = src;
        //img.visualEffect(inEffect, inOption);
        Theater.Util.show(img, inEffect, inOption);
      }, ((outOption||{}).duration || 1) * 1000 + 300, true);
    }else{
      Element.setStyle(img, options.style);
      img.src = src;
      //img.visualEffect('Appear', {transition:Effect.Transitions.full});
      jQuery(img).fadeIn();
    }
  }
};

//Theater.ImageChanger.interlude = 'ajax-loader.gif';
//new Image().src = Theater.ImageChanger.interlude; 

Theater.Util = {

  acmlStyleSize: function(element, names){
    return names.inject(0, function(memo, name){
      var tmp = parseInt(Element.getStyle(element, name));
      if(isNaN(tmp)) tmp = 0;
      return memo + tmp;
    });
  },
  
  getInnerDimentions: function (element){

    var h = [
      'border-left-width',   'padding-left',
      'border-right-width',  'padding-right'
    ];
    
    var v = [
      'border-top-width',    'padding-top',
      'border-bottom-width', 'padding-bottom'
    ];

    element = $(element);

    var width = element.offsetWidth - this.acmlStyleSize(element, h);
    var height = element.offsetHeight - this.acmlStyleSize(element, v);
    
    return {width: width, height: height};
  },
  
  getOuterDimentions: function (element){
    
    var h = ['margin-left', 'margin-right'];
    
    var v = ['margin-top', 'marrin-bottom'];
    
    element = $(element);
    
    var width = element.offsetWidth + this.acmlStyleSize(element, h);
    var height = element.offsetHeight + this.acmlStyleSize(element, v);
    
    return {width: width, height: height};
    
  },
  
  setOuterDimentions: function (element, size){
    
    function getDif(names){
      return names.inject(0, function(memo, name){
        var tmp = parseInt(Element.getStyle(element, name));
        if(isNaN(tmp)) tmp = 0;
        return memo + tmp;
      });
    }  

    var h = [
      'border-left-width',   'padding-left',  'margin-left',
      'border-right-width',  'padding-right', 'margin-right' 
    ];
    
    var v = [
      'border-top-width',    'padding-top',    'margin-top',
      'border-bottom-width', 'padding-bottom', 'marrin-bottom'
    ];
    
    element = $(element);
    var width = size.width - this.acmlStyleSize(element, h);
    var height = size.height - this.acmlStyleSize(element, v);
    
    Element.setStyle(element, {width:width + 'px', height:height + 'px'});
    
  },
  
  isGetImageDimention: true,
  
  getImageDimensions: function (img){
    if(!this.isGetImageDimention
    || navigator.userAgent.match(/opera|firefox|netscape/i)
    || !navigator.userAgent.match(/msie/i)){
      return {width:img.width, height:img.height};
    }
    new Insertion.Bottom(document.body,
      "<img id='getImageDimensions'"
    + " style='position:absolute;visibility:hidden;top:0px;left:0px;'/>");
    var wk = $('getImageDimensions');
    wk.src = img.src;
    var width = wk.offsetWidth;
    var height = wk.offsetHeight;
    Element.remove(wk);
    return {width:width, height:height};
  },
  
  calcCenter: function(inner, outer, diff){
    if(typeof inner == 'string' || typeof inner == 'number'){
      outer = parseInt(outer || 0);
      inner = parseInt(inner || 0);
      diff = parseInt(diff || 0);
      return Math.floor((outer - inner) / 2) + diff;
    }else{
      var outDim;
      if(outer == window){
        outDim = this.getWindowInnerDimenstions();
      }else{
        outDim = this.getInnerDimentions(outer);
      }
      var left = Math.floor(((outDim.width  || 0) - (inner.offsetWidth  || 0)) / 2);
      left += parseInt((diff && diff[0]) ? diff[0] : 0);
      var top  = Math.floor(((outDim.height || 0) - (inner.offsetHeight || 0)) / 2);
      top += parseInt((diff && diff[1]) ? diff[1] : 0);
      return [left, top];
    }
  },
  
  getWindowInnerDimenstions: function(){
    var width =  window.innerWidth
              || document.documentElement.clientWidth
              || document.body.clientWidth
              || 0;
    var height = window.innerHeight
              || document.documentElement.clientHeight
              || document.body.clientHeight
              || 0;
    return {width:width, height:height};
  },
  
  moveCenter: function (inner, outer){
    var cpos = Theater.Util.calcCenter(inner, outer);
    var opos, left, top;
    if(outer == window){
      Position.prepare();
      opos = [Position.deltaX, Position.deltaY];
      left = opos[0] + cpos[0];
      top = opos[1] + cpos[1];
    }else{
      opos = Position.cumulativeOffset(outer);
      left = opos[0] + cpos[0];
      top = opos[1] + cpos[1];
      border = Position.getBorder(outer);
      left += border[0];
      top += border[1];
    }
    Element.setStyle(inner, {left:left + 'px',top: top + 'px'});
  },
  
  coverWindow: function(element){
    element = $(element);
    var pos = Position.cumulativeOffset(element);
    var size = Theater.Util.getInnerDimentions(element);
    element._coverWindowLastSize = {left:pos[0] + 'px', top:pos[1] + 'px',
      height:size.height + 'px', width:size.width + 'px'};
    this.resizeCoverWindow(element);
    this.positionWinUpLeft(element);
    element._coverWindowEventResize = [
      window, 'resize', this.resizeCoverWindow.bind(this, element)
    ];
    element._coverWindowEventScroll = [
      window, 'scroll', this.positionWinUpLeft.bind(this, element)
    ]; 
    Event.observe.apply(Event, element._coverWindowEventResize);
    Event.observe.apply(Event, element._coverWindowEventScroll);
  },

  resizeCoverWindow: function(element){
    var dim = this.getWindowInnerDimenstions();
    this.setOuterDimentions(element, {width:dim.width, height:dim.height});
  },

  positionWinUpLeft: function(element){
    Position.prepare();
    Element.setStyle(element, {top:Position.deltaY + 'px', left:Position.deltaX + 'px'});
  },
  
  undoCoverWindow: function(element){
    element = $(element);
    Element.setStyle(element, element._coverWindowLastSize);
    Event.stopObserving.apply(Event, element._coverWindowEventResize);
    Event.stopObserving.apply(Event, element._coverWindowEventScroll);
    try{
      delete element._coverWindowLastSize;
      delete element._coverWindowEventResize;
      delete element._coverWindowEventScroll;
    }catch(e){
      element._coverWindowLastSize =null;
      element._coverWindowEventResize = null;
      element._coverWindowEventScroll = null;
    }
  },
  
  selectOptions: function(objects, names){
    if(names){  
      return  names.inject({}, function(memo, name){
        var wk = objects.detect(function(object){
          return (object[name] != null);
        });
        if(wk) memo[name] = wk[name];
        return memo;
      });
    }else{
      return objects.inject({}, function(memo, object){
        return $HH(object).inject(memo, function(_memo, pair){
          if(pair.value != null && !(pair.key in _memo)){
            _memo[pair.key] = pair.value;
          }
          return _memo;
        });
      });
    }
  },
  
  show: function(img, ef, option, time, callback){
    ef = ef.toLowerCase();
    option = (option || {});
    switch(ef){
      case "appear":
        ef = "fade";
        break;
      case "blinddown":
        ef = "blind";
        Object.extend(option, { direction: "vertical" });
        break;
      case "grow":
        ef = "scale";
        break;
      case "slidedown":
        ef = "slide";
        Object.extend(option, { direction: "down" });
        break;
    }
    jQuery(img).show(ef, option, time, callback);
  },
  
  hide: function(img, ef, option, time, callback){
    ef = ef.toLowerCase();
    option = (option || {});
    switch(ef){
      case "fade":
        break;
      case "puff":
        break;
      case "blindup":
        ef = "blind";
        Object.extend(option, { direction: "vertical" });
        break;
      case "switchoff":
        ef = "clip";
        Object.extend(option, { direction: "horizontal" });
        break;
      case "dropout":
        ef = "drop";
        Object.extend(option, { direction: "down" });
        break;
      case "squish":
        ef = "scale";
        break;
      case "slideup":
        ef = "slide";
        Object.extend(option, { direction: "up" });
        break;
    }
    jQuery(img).hide(ef, option, time, callback);
  }
};

Theater.PhotoFrame = Class.create();
Theater.PhotoFrame.prototype = {
  initialize: function(options){
    this.options = {
      name: 'PhotoFrame',
      frame: '',
      src: '',
      isDraggable: false,
      adjust: Theater.PhotoFrame.adjusts.ADJUST,
      width: null,
      height: null,
      left: null,
      top: null,
      filter: '',
      time: null,
      outEffect: null,
      inEffect: null,
      imgs: [],
      curtain: null,
      blank: null
    };
    Object.extend(this.options, options);
    this.preload(this.options.imgs);
    var _onload = function(){
      var frame = $(this.options.frame);
      Element.makePositioned(frame);
      Element.setStyle(frame, {overflow:'hidden'});      
      var dim = Theater.Util.getInnerDimentions(frame);
      var imgId = frame.id + "_img";
      var progressId = frame.id + "_progress";
      var curtain =  this.options.curtain || "";
      var size;
      if(curtain==""){
        size = "width:0px;height:0px;";
      }else{
        size = (dim) ?  "width:" + dim.width + "px;height:" + dim.height + "px;" : "";
      }
      frame.innerHTML = "<img id='" + imgId + "' src='" + curtain + "'"
      + " style='position:relative;top:0px;left:0px;" + size + "'/>"
      + "<div id='" + progressId + "' style='position:absolute;visibility:hidden;"
      + " top:0px;left:0px;filter:alpha(opacity=50);opacity:0.5;"
      + " font-size:9px;color:#ffffff;background-color:#000000;width:" + dim.width + "px;"
      + " font-family:Verdana;line-height:11px;padding:1px;margin:0px;'></div>";
      var img = $(imgId);
	  this.img = img;
      var progress = $(progressId);
	  this.progress = progress;
      this.imageChanger = new Theater.ImageChanger({
        img: img
      });
    }.bind(this);
    if(document.body){
      _onload();
    }else{
      Event.observe(window, 'load', _onload);
    }
  },
  
  show: function(options){
    var frame = $(this.options.frame);
    if(frame == null) return;
    var _options = Theater.Util.selectOptions([options, this.options]);
    var src = _options.src;
    if(src == null) return;
    if(src == ""){
      if(this.options.blank != null){
        src = this.options.blank;
      }else{
        return;
      }
    }
    var imgObj = new Image();
    imgObj.src = src;
    var innerDimentions = Theater.Util.getInnerDimentions(frame);
    var frameWidth = innerDimentions.width;
    var frameHeight = innerDimentions.height;
    var frameRaito = 1;
    try{
      frameRaito = frameHeight / frameWidth;
    }catch(e){}
    var img = this.img;
    var progress = this.progress;
    if(_options.isDraggable == true){
      this.dragObj = new Draggable(img, {
        starteffect:null, reverteffect:null, endeffect:null
      });
      Droppables.add(frame);
      this.stopClick = [frame, 'click', function(event){
        event = event || window.event;
        Event.stop(event);  
      }];
      Event.observe.apply(Event, this.stopClick);
      this.resetPos = [frame, 'dblclick', function(){
        Element.setStyle(img, {'left':this.left, 'top':this.top});  
      }.bind(this)];
      Event.observe.apply(Event, this.resetPos);
      this.bkCursor = Element.getStyle(img, 'cursor');
      Element.setStyle(img, {cursor: 'move'});
    }else if(this.dragObj){
      this.dragObj.destroy();
      delete this.dragObj;
      Droppables.remove(frame);
      Event.stopObserving.apply(Event, this.stopClick);
      Event.stopObserving.apply(Event, this.resetPos);
      Element.setStyle(img, {cursor: this.bkCursor});
    }

    var adjust = _options.adjust;
    if(isNaN(adjust)){
      adjust = Theater.PhotoFrame.adjusts[adjust];
    }
    
    var height, width;
    var imgDim;
    
    switch(adjust){
      case Theater.PhotoFrame.adjusts.ADJUST:
        imgDim = Theater.Util.getImageDimensions(imgObj);
        if(imgDim.width < frameWidth
        && imgDim.height < frameHeight){
          height = imgDim.height;
          width = imgDim.width;
          break;
        }
      case Theater.PhotoFrame.adjusts.ALL:
        imgDim = Theater.Util.getImageDimensions(imgObj);
        var raito = imgDim.height / imgDim.width;
        if(raito > frameRaito){
          height = frameHeight;
          width = Math.ceil(frameHeight / raito);
        }else{
          width = frameWidth + "px";
          height = Math.ceil(frameWidth * raito);
        }
        break;
      case Theater.PhotoFrame.adjusts.FULL:
        height = frameHeight;
        width = frameWidth;
        break;
      case Theater.PhotoFrame.adjusts.STATIC:
        imgDim = Theater.Util.getImageDimensions(imgObj);
        height = imgDim.height;
        width = imgDim.width;
        break;
      case Theater.PhotoFrame.adjusts.LAST:
      default:
        height = Element.getStyle(img, 'height');
        width = Element.getStyle(img, 'width');
        if(isNaN(height) || isNaN(width)){
          imgDim = Theater.Util.getImageDimensions(imgObj);
        }
        if(isNaN(height)) height = imgDim.height;
        if(isNaN(width)) width = imgDim.width;
    }
    width = addPx(calcSize(width, _options.width));
    height = addPx(calcSize(height, _options.height));
    
    this.left = _options.left || Theater.Util.calcCenter(width, frameWidth);
    this.left = addPx(this.left);
    this.top = _options.top || Theater.Util.calcCenter(height, frameHeight);
    this.top = addPx(this.top);
    
    var effect = _options.effect || [];
    this.imageChanger.change({
      style: {top:this.top, left:this.left, width:width, height: height},
      filter: _options.filter,
      time: _options.time,
      src: imgObj.src,
      outEffect: _options.outEffect,
      inEffect: _options.inEffect,
      interlude: _options.interlude,
      effect: _options.effect
    });

    function calcSize(size, option){
      if(option != null
      && option.toString().match(/^([\+\-])?(\d+)(px|per|pr|\%)?$/i) != null){
        var sign = RegExp.$1;
        var number = parseFloat(RegExp.$2);
        var unit = RegExp.$3;
        size = parseInt(size);
        if(number){
          if(unit == "per" || unit == "pr" || unit == "%"){
            size = (size * number / 100);
          }else{
            size = number;
          }
        }
        if(sign != null && sign != ""){
          size = eval("size" + sign + "number");
          size = (size < 0) ? 0 : size;
        }
      }
      return size;
    }
    
    function addPx(size){
      return (size.toString().match(/^\d+$/)) ? size + 'px' : size;
    }
  },
  
  preload: function(imgs){
    var loadings = [];
    var time = 0;    
    var _update = function(){
      if(!this.progress) return;
      var complete = loadings.inject(0, function(count, img){
        if(img.complete) count++;
        return count;
      });
      var error = loadings.inject(0, function(count, img){
        if(img._error) count++;
        return count;
      });
      var completeMark = "<div style='float:left;height:7px;width:7px;margin:1px;"
      + "border:solid #ffffff 1px;background-color:#ffffff;overflow:hidden;'></div>";
      var stillMark = "<div style='float:left;height:7px;width:7px;margin:1px;"
      + "border:solid #ffffff 1px;overflow:hidden;'></div>";
      var errorMark = "<div style='float:left;height:7px;width:7px;margin:1px;"
      + "border:solid #ffffff 1px;overflow:hidden;'>?</div>";

      if(complete + error < loadings.length){
        if(time > 100){
          clearInterval(this.tid);
          Element.setStyle(this.progress, {visibility:'hidden'});
          return;
        }
        this.progress.innerHTML = completeMark.repeat(complete)
        + errorMark.repeat(error)
        + stillMark.repeat(loadings.length - complete - error)
        + '&nbsp;IMG LOADING...';
        Element.setStyle(this.progress, {visibility:'visible'});
        time++;
      }else{
        var str = completeMark.repeat(complete) + errorMark.repeat(error);
        if(error == 0){
          str += '&nbsp;COMPLETED.';
        }else{
          str += '&nbsp;ERROR OCCURRED.';
        }
        this.progress.innerHTML = str;
        Element.setStyle(this.progress, {visibility:'visible'});
        clearInterval(this.tid);
        Theater.Timer.setTimeout(this.name, function(){
          Element.setStyle(this.progress, {visibility:'hidden'});
          this.progress.innerHTML = '';
        }.bind(this), 1000, false);
      } 
    };
    
    if(!(imgs instanceof Array)){
      imgs = $HH(imgs).flatten();
    }
    
    var _onerror = function(){
      this._error = true;
    };
    
    imgs.each(function(img){
      var imgObj = new Image();
      imgObj.onerror = _onerror;
      imgObj.onabort = _onerror;
      imgObj.src = img;
      loadings.push(imgObj);
    }.bind(this));
    
    if(this.tid) clearInterval(this.tid);
    this.tid = setInterval(_update.bind(this), 1000);
    _update.bind(this)();
  }
};

Theater.PhotoFrame.adjusts = {
  ADJUST : 0,
  STATIC : 1,
  ALL    : 2,
  FULL   : 3,
  LAST   : 4
};

Theater.Menu = Class.create();
Object.extend(Theater.Menu, {
  no: 500,
  baseNo: 500,
  currents:{},
  closeAll: function(){
    while(this.no > this.baseNo){
      this.currents[this.no].close();
    }
  }
});
Theater.Menu.prototype = {
  initialize: function(options){
    
    Theater.Menu.no += 10;
    this.no = Theater.Menu.no;
    Theater.Menu.currents[this.no] = this;
    
    this.options = {
      outer: document.body,
      isCloseBtn: false,
      isMinBtn: false,
      isMaxBtn: false,
      actions: {},
      width: '',
      height: '',
      title: 'Menu' + ((this.no - Theater.Menu.baseNo) / 10),
      focusName : null
    };
    
    Object.extend(this.options, options);

    this.isMinimized = false;
    this.isMaximized = false;
    
    new Insertion.Bottom(document.body,
      "<div id='mask_" + this.no + "' class='mask'"
    + " style='position:absolute;top:0px;left:0px;visibility:hidden;"
    + " z-index:" + this.no + ";'></div>"
    + "<div id='menu_" + this.no + "' class='menu'"
    + " style='position:absolute;visibility:hidden;top:0px;left:0px;"
    + " z-index:" + (this.no + 1)  + ";'>"
    + "<div id='handle_" + this.no + "' class='menu-handle'>"
    + "<div id='control_" + this.no + "' class='menu-handle-control' style='float:right;'>"
    + "</div>"
    + "<div class='menu-handle-title'>" + this.options.title
    + "</div>"
    + "<button id='dummyBtn_" + this.no + "' tabIndex='-1'"
    + " style='position:absolute;height:0px;width:0px;border-style:none;'>"
    + "</button>"
    + "</div>"
    + "<form id='contents_" + this.no + "' class='menu-contents'"
    + " onsubmit='return false;'></form>"
    + "</div>");
    this.mask = $("mask_" + this.no);
    this.menu = $("menu_" + this.no);
    this.handle = $("handle_" + this.no);
    this.control = $("control_" + this.no);
    this.dummyBtn = $("dummyBtn_" + this.no);
    this.contents = $("contents_" + this.no);
    
    Theater.Util.coverWindow(this.mask);
    Element.setStyle(this.mask, {visibility:'visible'});
    
    var str = "";
    
    if(this.options.isMinBtn){
      str += "<button id='minimize_" + this.no + "' class='minimize'>＿</button>";
    }
    
    if(this.options.isMaxBtn){
      str += "<button id='maximize_" + this.no + "' class='maximize'>□</button>";  
    }
    
    if(this.options.isCloseBtn){
      str += "<button id='close_" + this.no + "' class='close'>×</button>";  
    }     
    Element.update(this.control, str);

    if(this.options.isMinBtn){
      this.minBtn = $('minimize_' + this.no);
      this.minBtnEvt = [this.minBtn, 'click', this.minimize.bind(this)];
      Event.observe.apply(Event, this.minBtnEvt);
    }
    
    if(this.options.isMaxBtn){
      this.maxBtn = $('maximize_' + this.no);
      this.maxBtnEvt = [this.maxBtn, 'click', this.maximize.bind(this)];
      Event.observe.apply(Event, this.maxBtnEvt);
    }
    
    if(this.options.isCloseBtn){
      this.closeBtn = $('close_' + this.no);
      Event.observe(this.closeBtn, 'click', this.close.bind(this));  
    }
    
    this.makeDraggable();
    
    Element.update(this.contents, this.options.contents);
    $HH(this.options.actions).each(function(pair){
      var elem = null;
      var elements = this.contents.elements;
      if(isNaN(pair.key)){
        elem = elements[pair.key];
      }else{
        for(var i = 0; i < elements.length; i++){
          if(elements[i].name == pair.key){
            elem = elements[i];
          }
        }
      }
      if(elem){
        Event.observe(elem, 'click', function(){
          if(Theater.Menu.no != this.no) return;
          pair.value.bind(elem, this)();
        }.bind(this));
      }
    }.bind(this));
    
    Element.setStyle(this.menu, {
      width:this.options.width,
      height:this.options.height
    });
    this.open();
  },
  
  makeDraggable: function(){
    if(!this.dragObj){
      this.dragObj = new Draggable(this.menu, {
        handle:this.handle,
        starteffect:Prototype.emptyFunction,
        reverteffect:Prototype.emptyFunction,
        endeffect:Prototype.emptyFunction
      });
      Element.setStyle(this.handle, {'cursor':'move'});
    }
  },

  undoDraggable: function(){
    if(this.dragObj){
      this.dragObj.destroy();
      delete this.dragObj;
      Element.setStyle(this.handle, {'cursor':''});
    }
  },
  
  open: function(){
    Theater.Util.moveCenter(this.menu, this.options.outer);
    Element.setStyle(this.menu, {visibility:'visible'});
    try{
      var name = this.options.focusName;
      if(name){
        this.contents.elements[name].focus();
      }else{
        this.dummyBtn.focus();
      }
    }catch(e){}
  },
  
  close: function(){
    if(Theater.Menu.no != this.no) return;
    Element.setStyle(this.menu, {visibility:'hidden'});
    Element.setStyle(this.mask, {visibility:'hidden'});
    Element.remove(this.menu);
    Element.remove(this.mask);
    delete Theater.Menu.currents[this.no];
    Theater.Menu.no -= 10;
    if(this.options.onClose){
      this.options.onClose();
    }
    if(Theater.Menu.no == Theater.Menu.baseNo && this.options.onCloseAll){
      this.options.onCloseAll();
    }
  },

  disableControl: function(){
    if(this.minBtn) this.minBtn.disabled = true;
    if(this.maxBtn) this.maxBtn.disabled = true;
  },
  
  enableControl: function(){
    if(this.minBtn) this.minBtn.disabled = false;
    if(this.maxBtn) this.maxBtn.disabled = false;    
  },
  
  minimize: function(){
    if(Theater.Menu.no != this.no) return;
    this.disableControl();
    if(!this.isMinimized){
      if(this.maxBtn) Element.setStyle(this.maxBtn, {visibility:'hidden'});
      this.lastDim = Theater.Util.getInnerDimentions(this.menu);
      var height = this.handle.offsetHeight
        + Theater.Util.acmlStyleSize(this.handle, ['margin-top', 'amrgin-bottom']);
        + Theater.Util.acmlStyleSize(this.menu, ['padding-top']);
      Element.hide(this.contents);
      Element.setStyle(this.menu, {height:height + 'px'});
      this.isMinimized = true;
    }else{
      if(this.maxBtn)   Element.setStyle(this.maxBtn, {visibility:'visible'});
      Element.show(this.contents);
      Element.setStyle(this.menu, {height:this.lastDim.height + 'px'});
      delete this.lastHeight;
      this.isMinimized = false; 
    }
    this.enableControl();
  },
  
  maximize: function(){
    if(Theater.Menu.no != this.no) return;
    this.disableControl();
    if(!this.isMaximized){
      if(this.minBtn) Element.setStyle(this.minBtn, {visibility:'hidden'});
      this.undoDraggable();
      Theater.Util.coverWindow(this.menu);
      this.isMaximized = true;
    }else{
      if(this.minBtn) Element.setStyle(this.minBtn, {visibility:'visible'});
      Theater.Util.undoCoverWindow(this.menu);
      this.makeDraggable();
      this.isMaximized = false;
    }
    this.enableControl();
  }
  
};
