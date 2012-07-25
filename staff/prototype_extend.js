// for theater.js v2.0.3
if(typeof _IG_Prefs != "undefined"){
  window.$ = function(element) {
    if (arguments.length > 1) {
      for (var i = 0, elements = [], length = arguments.length; i < length; i++)
        elements.push($(arguments[i]));
      return elements;
    }
    if (typeof element == 'string')
      try{element = _gel(element);}catch(e){}
    return Element.extend(element);
  };
}

Object.extend(Position, {
  positionedOffset: function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      if(!this.isIncludeBorder){
        var border = this.getBorder(element.offsetParent);
        valueT += border[0];
        valueL += border[1];
      }

      element = element.offsetParent;
      if (element) {
        if(element.tagName=='BODY') break;
        var p = Element.getStyle(element, 'position');
        if (p == 'relative' || p == 'absolute') break;
      }
    } while (element);
    return [valueL, valueT];
  },

  page: function(forElement) {
    var valueT = 0, valueL = 0;

    var element = forElement;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;

      if(!this.isIncludeBorder){
        var border = this.getBorder(element.offsetParent);
        valueT += border[1];
        valueL += border[0];
      }
      
      // Safari fix
      if (element.offsetParent==document.body)
        if (Element.getStyle(element,'position')=='absolute') break;

    } while (element = element.offsetParent);

    element = forElement;
    do {
      valueT -= element.scrollTop  || 0;
      valueL -= element.scrollLeft || 0;
    } while (element = element.parentNode);

    return [valueL, valueT];
  },
  
  getBorder: function(element){
    if(element == null){
      return [0, 0];
    }
    var top , left, style;
    style = Element.getStyle(element, 'border-top-style');
    if(style != 'none'){
      top  = parseInt(Element.getStyle(element, 'border-top-width'));
    }
    style = Element.getStyle(element, 'border-left-style');
    if(style != 'none'){
      left = parseInt(Element.getStyle(element, 'border-left-width'));
    }
    top  = (isNaN(top))  ? 0 : top;
    left = (isNaN(left)) ? 0 : left;
    return [left, top];
  },
  
  setIsIncludeBorder: function(){
    var id = (new Date()).getTime();
    new Insertion.Bottom(document.body,
      "<div id='parent_" + id + "'" 
      + " style='border:solid blue 10px; padding:0px;"
      + " position:absolute; visibility:hidden;'>"
      + " <div id='child_" + id + "'></div></div>");
    
    if($('child_' + id).offsetTop == 0){
      this.isIncludeBorder = false;
    }else{
      this.isIncludeBorder = true;
    }
    Element.remove('parent_' + id);
  }
});
Event.observe(window, 'load', Position.setIsIncludeBorder.bind(Position));

if (/Konqueror|Safari|KHTML/.test(navigator.userAgent)) {
  Position.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      
      if(!this.isIncludeBorder){
        var border = this.getBorder(element.offsetParent);
        valueT += border[1];
        valueL += border[0];
      }
      
      if (element.offsetParent == document.body)
        if (Element.getStyle(element, 'position') == 'absolute') break;

      element = element.offsetParent;
    } while (element);

    return [valueL, valueT];
  }
}else{
  Position.cumulativeOffset = function(element) {
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      
      if(!this.isIncludeBorder){
        var border = this.getBorder(element.offsetParent);
        valueT += border[1];
        valueL += border[0];
      }
      
      element = element.offsetParent;
    } while (element);
    return [valueL, valueT];
  }
}

var HandleHash = Class.create();
//Object.extend(HandleHash.prototype, Enumerable);
Object.extend(HandleHash.prototype, Hash.prototype);
Object.extend(HandleHash.prototype, {
  initialize: function(object){
    this.hash = (object || {});
  },
  
  _each: function(iterator) {
    for (key in this.hash) {
      var value = this.hash[key];
      var pair = [key, value];
      pair.key = key;
      pair.value = value;
      iterator(pair);
    }
  },
  
  merge: function(hash) {
    return $HH(hash).inject(this.hash, function(mergedHash, pair) {
      mergedHash[pair.key] = pair.value;
      return mergedHash;
    });
  },
  
  remove: function() {
    var result;
    for(var i = 0, length = arguments.length; i < length; i++) {
      var value = this.hash[arguments[i]];
      if (value !== undefined){
        if (result === undefined) result = value;
        else {
          if (result.constructor != Array) result = [result];
          result.push(value)
        }
      }
      delete this.hash[arguments[i]];
    }
    return result;
  },
  
  flatten: function() {
    return this.inject([], function(array, pair) {
      var value = pair.value;
      if(typeof value == "function") return array;
      return array.concat(
        value && !(["string", "number", "boolean"].include(typeof value)) ?
          $HH(value).flatten() : [value]);
    });
  }
});
function $HH(object){
  if(object && object.constructor == HandleHash) return object;
  return new HandleHash(object);
}
Object.extend(Abstract.TimedObserver.prototype, {
  registerCallback: function() {
    this.tid = setInterval(this.onTimerEvent.bind(this), this.frequency * 1000);
  },
  
  stop: function(){
    clearInterval(this.tid);
  }
});
Object.extend(String.prototype, {
  repeat: function(time){
    var ret = "";
    time.times(function(){
      ret += this;
    }.bind(this));
    return ret;
  }
});
Event.limit = function(event){
  if(event.stopPropagation){
    event.stopPropagation();
  }else{
    event.cancelBubble = true;
  }
}
