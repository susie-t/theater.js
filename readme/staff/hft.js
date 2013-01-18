/*  hft.js, version 1.0.1
 *  (c) 2011 susie-t
/*--------------------------------------------------------------------------*/
var HFT = {};
HFT._index = 0;
HFT.Request = function(url, options) {
  this.url = url;
  this.options = options;
  var _this = this;
  var iframe = document.createElement('iframe');
  with(iframe.style){
    visibility = "hidden"; position = "absolute";
    top = left = width = height = "0px";
  }
  iframe.id = "_HFT_transport_" + ((HFT._index == Number.MAX_VALUE) ? 0 : HFT._index++);
  document.body.appendChild(iframe);
  try{
    iframe.src = url;
  }catch(e){
    dispatchException(e);
    return;
  }
  var count = 0;
  var tid = setInterval(function(){
    var fdb = null;
    try{
      fdb = getIFrameDocument(iframe.id).body;
      if(fdb == null) throw new Error();
    }catch(e){
      if(count++ > (options.timeout || 100)){
        clearInterval(tid);
        document.body.removeChild(iframe);
        dispatchException(e);
        return;
      }
      return;
    }
    clearInterval(tid);
    var responseText = (fdb.innerHTML.match(/\<pre\>((?:[^<]|\r|\n)*)(?:\<\/pre\>)?/i)||["",""])[1];
    responseText = responseText.replace(/&lt;/ig, "<")
                               .replace(/&gt;/ig, ">")
                               .replace(/&amp;/ig, "&");
    var transport = {
      responseText: responseText
    };
    options.onComplete(transport);
    document.body.removeChild(iframe);
  }, 100);
  
  function dispatchException(exception) {
    (options.onException || function(){})(_this, exception);
  }
};

function getIFrameDocument(aID){
  if (document.getElementById(aID).contentDocument){  
    return document.getElementById(aID).contentDocument;
  } else {
    return document.frames[aID].document;
  }
}
