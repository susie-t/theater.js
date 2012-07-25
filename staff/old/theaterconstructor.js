// for theater.js v2.0.3
var Theater = {};
Theater.Constructor = {
  filename: "theaterconstructor",
  list: [
    ['prototype.js','utf-8'],
    ['prototype_extend.js','utf-8'],
    ['effects.js','utf-8'],
    ['dragdrop.js','utf-8'],
    ['jquery.js','utf-8'],
    ['theater.js','utf-8']
  ],
  included: {},
  path: "",
  construct: function(){
    var tags = document.getElementsByTagName("script");
    for(var i in tags){
      var tag = tags[i];
      var regExp = new RegExp(this.filename + "\\.js(\\?.*)?$");
      if(tag.src && tag.src.match(regExp)){
        this.path = tag.src.replace(regExp,'');
        break;
      }
    }
    //this.include('firebug/firebug.js','utf-8');
    //this.include('firebug/firebugx.js','utf-8');
    if(typeof _IG_Prefs == "undefined"){
      for(var i = 0; i < this.list.length; i++){
        this._include.apply(this, this.list[i]);
      }
    }
  },  
  include: function (src, charset, isC){
    if(isC) src = this.path + src; 
    try{
      if(src in this.included) return;
      if(document.body){
        var elem = document.createElement('script');
        elem.language = 'javascript';
        elem.src = src;
        elem.characterSet = charset;
        document.body.appendChild(elem);
      }else{
        var str = "<script language='javascript' src='" + src + "'";
        str += (charset) ? " charset='" + charset + "'" : "";
        str += "></script>";
        document.write(str);
      }
      this.included[src] = true;
    }catch(e){
      alert("include ERROR: " + e);
    }
  },
  _include: function(src, charset){
    this.include(src, charset, true);
  }
};
Theater.Constructor.construct();
