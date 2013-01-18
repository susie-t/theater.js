/*  readme.js, version 3.0.0
 *  (c) 2008-2012 susie-t
/*--------------------------------------------------------------------------*/
jQuery.noConflict();
var Readme = Class.create();
Readme.version = "3.0.0";
Readme.prototype = {
  initialize: function(obj) {
    window.__readme = this;
    this.writePage = writePage;
    var debug = Readme.debug;
    debug.isValid = true;

    var locationPage = "staff/location.htm?" + encodeURIComponent(location.href.replace(/\?.*$/, "") + "?");
    //var locationPage = "staff/location.htm?";

    var base = $('base');
    var index = $("index");
    var title = $("title");
    var date = $("date");
    var menu = $("menu");

    if(obj instanceof Array) {
      obj = {
        isSimple: true,
        isHeadListNumber: false,
        page: {
          "": {
            name: "",
            title: title ? title.innerHTML : '',
            date: date ? date.innerHTML : '',
            src: obj
          }
        }
      };
      isSimple = true;
    }

    var srcDir = obj.srcDir || "readmesrc";
    var suffix = obj.suffix || ".txt";
    var imgDir = obj.imgDir || "img";
    var topPage = obj.topPage || null;
    var defaultPage = (location.search || "").substring(1);
    var isDiary = !!(obj.isDiary);
    var isAjax = (obj.isAjax !== false);
    var isRefFromSrc = obj.isRefFromSrc || false;
    var isHTML = !!(obj.isHTML)
    var terop = obj.terop;
    var isHeadListNumber = isDiary ? false : (obj.isHeadListNumber !== false);
    var isWeb = obj.isWeb;
    var isForPaste = obj.isForPaste;
    var isPrettyPrint = obj.prettyPrint || true;
    var defaultPrettyPrint = obj.defaultPrettyPrint || false;

    var isFirefox = (/firefox/i).test(navigator.userAgent); //Firefoxバグ?対応
    var current = [];

    var select = null;
    var isSimple = obj.isSimple;

    //var AjaxOrHFT = Ajax;

    /*@cc_on
    /*@if(@_jscript_version > 5.6)
        //AjaxOrHFT = HFT;
      /*@end
    @*/

    var pages = {};
    var pagesItr = [];
    if(obj.page instanceof Array){
      obj.page.each(function(data){
        var key;
        var hash = $H(data);
        if(data instanceof Array){
          key = data[0];
          pages[key] = data[1];
        }else if(["string", "number"].include(typeof(data))){
          key = data;
          pages[key] = {};
        }else if(hash.keys().length == 1){
          key = hash.keys().first();
          pages[key] = hash.values().first();
        }else{
          key = data.key;
          pages[key] = data;
        }
        pagesItr.push(key);
      });
    }else{
      pages = Object.extend(pages, obj.page);
      pagesItr = $H(pages).keys();
    }

    if(isDiary) {
      $H(pages).each(function(pair, index) {
        pair.value.title = "Diary";
        pair.value.name = pair.value.date = (pair.key).toString().replace(/(\d{4})(\d{2})/, "$1/$2");
      });
      pages[pagesItr.last()].isDefault = true;
      defaultPage = defaultPage || pagesItr.last();
    }

    var bN = {
      BACK: "戻る",
      RELOAD: "リロード",
      TOP: "トップ",
      DEFAULT: "デフォルト",
      CATALOG: "一覧",
      SEARCH: "検索",
      HELP: "ヘルプ",
      ROOT: "ルートフォルダ",
      SRC: "ソースフォルダ"
    };
    
    pages = Object.extend(pages, {
      _catalog: {
        name: "<" + bN.CATALOG + ">"
      },
      _search: {
        name: "<" + bN.SEARCH + ">"
      }
    });
    pagesItr.push("_catalog");
    pagesItr.push("_search");
    
    if(!isWeb){
      pages = Object.extend(pages, {
        _help: {
          name: "<" + bN.HELP + ">",
          title: "readme.js v" + Readme.version + " ヘルプ",
          src: ["help", "rule", "property", "tips", "history"],
          srcDir: "readmesrc",
          isDiary: false,
          isHeadListNumber: true
        }
      });
      pagesItr.push("_help");
    }

    var button = {};

    if(isSimple){
      button[bN.BACK] = function() { backPage(); };
      button[bN.RELOAD] = function() { reloadPage(); };
      if(!isWeb){
        srcDir = "./";
        button[bN.HELP] = function() { writePage("_help"); };
        button[bN.ROOT] = "./";
        button[bN.SRC] = srcDir;
      }
    }else if(isAjax) {
      button[bN.BACK] = function() { backPage(); };
      button[bN.RELOAD] = function() { reloadPage(); };
      button[bN.TOP] = function() { writePage(); };
      button[bN.DEFAULT] = function() { writePage(defaultPage); };
      button[bN.CATALOG] = function() { writePage("_catalog"); };
      button[bN.SEARCH] = function() { writePage("_search"); };
      if(!isWeb){
        button[bN.HELP] = function() { writePage("_help"); };
        button[bN.ROOT] = "./";
        button[bN.SRC] = srcDir;
      }
    } else {
      button[bN.BACK] = "javascript:history.back();";
      button[bN.RELOAD] = "javascript:location.reload();";
      //button[bN.TOP] = locationPage + encodeURIComponent(topPage || $H(pages).keys()[0]);
//      button[bN.TOP] = getRedirect(topPage || $H(pages).keys()[0]);
      button[bN.TOP] = getRedirect(topPage || pagesItr.first());
      button[bN.CATALOG] = getRedirect("_catalog");
      button[bN.SEARCH] = getRedirect("_search");
      if(!isWeb){
        button[bN.HELP] = getRedirect("_help");
        button[bN.ROOT] = "./";
        button[bN.SRC] = srcDir;
      }
    }

    //button = Object.extend(button, (obj.button || {}));
    createMenu(button);
    if(obj.button){
      menu.appendChild(document.createTextNode("  "));
      createMenu(obj.button);
    }
    
    function createMenu(_button){
      menu.appendChild(document.createTextNode("["));
      $H(_button).each(function(pair, index) {
        if(pair.key == bN.DEFAULT && defaultPage == "") throw $continue;
        var link = document.createElement("a");
        link.innerHTML = "<span style='white-space:nowrap;'>" + (link.id = pair.key) + "</span>";
        if(typeof pair.value == "string") {
          if([bN.BACK, bN.RELOAD, bN.TOP, bN.DEFAULT, bN.CATALOG, bN.SEARCH, bN.HELP].include(pair.key) == false) {
            link.target = "_blank";
          }
          link.href = pair.value;
        } else {
          link.href = "javascript:void(0);";
          link.onclick = pair.value;
        }
        if(index > 0) menu.appendChild(document.createTextNode("|"));
        menu.appendChild(link);
      });
      menu.appendChild(document.createTextNode("]"));
    }

    if(!isSimple) {
      var str = '<select id="select">';
      //str = $H(pages).inject(str, function(memo, pair) {
      //  if(!defaultPage && pair.value.isDefault) defaultPage = pair.key;
      //  memo += '<option value="' + pair.key + '">' + (pair.value.name || pair.value.title || pair.key) + '</option>';
      //  return memo;
      //});
      str = pagesItr.inject(str, function(memo, key) {
        var value = pages[key];
        if(!defaultPage && value.isDefault) defaultPage = key;
        memo += '<option value="' + key + '">' + (value.name || value.title || key) + '</option>';
        return memo;
      });
      str += '</select>';
      new Insertion.After("menu", str);
      select = $("select");
      select.onchange = (isAjax) ?
        function() {
          writePage(this.options[this.selectedIndex].value);
        } :
        function() {
          location.href = getRedirect(this.options[this.selectedIndex].value);
        };
    }

    writePage(defaultPage);

    function writePage(key, isBack) {
//      key = key || topPage || $H(pages).keys()[0];
      key = key || topPage || pagesItr.first();
      var page = pages[key];
      var src = page.src || [key];
      var _srcDir = (page.srcDir || srcDir) + ((key && page.src) ? "/" + key : "");
      if(!isWeb) $(bN.SRC).href = _srcDir;
      var _suffix = page.suffix || suffix;
      var _imgDir = page.imgDir || imgDir;
      var _isDiary = (page.isDiary != null) ? page.isDiary : isDiary;
      var _isRefFromSrc = (page.isRefFromSrc != null) ? page.isRefFromSrc : isRefFromSrc;
      var _isHTML = (page.isHTML != null) ? page.isHTML : isHTML;
      var _terop = page.terop || terop;
      var _isHeadListNumber = (page.isHeadListNumber != null) ? page.isHeadListNumber : isHeadListNumber;
      var _isForPaste = (page.isForPaste != null) ? page.isForPaste : isForPaste;
      var _prettyPrint = (page.prettyPrint != null) ? page.prettyPrint : isPrettyPrint;
      var _defaultPrettyPrint = (page.defaultPrettyPrint != null) ? page.defaultPrettyPrint : defaultPrettyPrint;
      title.innerHTML = page.title || obj.title || page.name || key || "&nbsp;";
      date.innerHTML = page.date || obj.date || "&nbsp;";
      base.innerHTML = "";
      index.innerHTML = '<div id="indexRemark">＞＞＞＞ここをクリックすると目次を作成します＜＜＜＜</div>';
      Element.addClassName(index, "notPrint");

      switch(key) {

        case "_catalog":

          new Insertion.Bottom(base,
            "<form id='searchForm' onsubmit='return false;'>"
            + "<span id='message'>しばらくお待ちください・・・</span>"
            + "<div id='searchResult'></div>"
            + "</form>");

          index.style.display = "none";
          index.onclick = function() { };
          index.style.cursor = "";

          setTimeout(catalog, 1 * 1000);

          break;

        case "_search":

          new Insertion.Bottom(base,
            "<form id='searchForm' onsubmit='return false;'>"
            + "検索対象は変換前のテキストです。AND、OR検索は大文字小文字を区別します。<br/>"
            + "<input id='searchText' type='text'/><input type='text' style='display:none;'/>"
            + "<button id='searchButton'>検索</button>"
            + "<input type='radio' name='searchType' value='and' checked/> AND検索 "
            + "<input type='radio' name='searchType' value='or'/> OR検索 "
            + "<input type='radio' name='searchType' value='regExp'/> 正規表現検索"
            + "<input type='checkbox' name='ignoreCase' checked /> 大文字・小文字区別なし"
            + "<div id='searchResult'></div>"
            + "</form>");

          $("searchButton").onclick = search;
          index.style.display = "none";
          index.onclick = function() { };
          index.style.cursor = "";

          break;

        default:
        
          //var headList = document.createElement(_isHeadListNumber ? "ol" : "ul");
          
          var headList;
          if(base.tagName.toLowerCase() != "section"){
            var headList = document.createElement("section");
            base.appendChild(headList);
          }else{
            var headList = base;
          }

          var srcCount = 0;
          src.each(function(value, index) {
            var __isHTML = (_isHTML || /\.html?$/i.test(value));
//            new AjaxOrHFT.Request(_srcDir + '/' + value + _suffix, {
//              onComplete: function(req) {
//                var text = req.responseText;
//                if(index) new Insertion.Bottom(headList, "<div class='end'></div>");
//                if(__isHTML) {
//                  text = text.replace(/^\*+([^\*].*)\[\#(.*)\](?=\r\n)/g, "\r\n<span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a>"
//                       + "<br/>[&nbsp;<a href='" + _srcDir + "' target='_blank'>" + _srcDir + "</a>/" + value + _suffix + "&nbsp;]</span><li id='$2'>$1</li>");
//                } else {
//                  text = readWikiSrc(text, _srcDir, value + _suffix);
//                }
//                new Insertion.Bottom(headList, text);
//              },
//              onException: function(obj, e) {
//                //prototype.jsがローカルファイルを必ずevalするため。デバッグ時はコメントアウト。
//                if(e.name.toLowerCase() == "syntaxerror") return;
//                var msg = "AjaxOrHFT Error : " + obj.url;
//                Readme.Error = e;
//                if(!isWeb) alert(msg);
//                throw new Error(msg);
//              }
//            });
            jQuery.ajax({
              cache : false,
              dataType : "text",
              type : "get",
              url : _srcDir + '/' + value + _suffix,
              success : function(text) {
                if(index) new Insertion.Bottom(headList, "<div class='end'></div>");
                if(__isHTML) {
                  //text = text.replace(/^\*+([^\*].*)\[\#(.*)\](?=\r\n)/g, "\r\n<span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a>"
                  //     + "<br/>[&nbsp;<a href='" + _srcDir + "' target='_blank'>" + _srcDir + "</a>/" + value + _suffix + "&nbsp;]</span><li id='$2'>$1</li>");
                  text = text.replace(/^\*+([^\*].*)\[\#(.*)\](?=\r\n)/g, "\r\n<span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a>"
                       + "<br/>[&nbsp;<a href='" + _srcDir + "' target='_blank'>" + _srcDir + "</a>/" + value + _suffix + "&nbsp;]</span><li id='$2'>$1</section>");
                } else {
                  text = readWikiSrc(text, _srcDir, value + _suffix);
                }
                new Insertion.Bottom(headList, text);
                
                srcCount++;
                
                if(srcCount == src.length){
                  if(_isHeadListNumber){
                    (function($){
                      var num1 = 1;
                      var wk = "";
                      $(headList).children("section").each(function(){
                        var title1 = $($(this).find("h2.title").get(0));
                        title1.html(num1 + ".&nbsp;" + title1.html());
                        var num2 = 1;
                        $(this).children("section").each(function(){
                          var title2 = $($(this).find("h2.title").get(0));
                          title2.html(num1 + "-" + num2 + ".&nbsp;" + title2.html());
                          var num3 = 1;
                          $(this).children("section").each(function(){
                            var title3 = $($(this).find("h2.title").get(0));
                            title3.html(num1 + "-" + num2 + "-" + num3 + ".&nbsp;" + title3.html());
                            num3++;
                          });
                          num2++;
                        });
                        num1++;
                       });
                    })(jQuery);
                  }
                  
                  if(_prettyPrint) {
                    prettyPrint();
                  }
                  
                  if(_isForPaste){
                    (function($){
                      //$(headList).find("ul li div.title, section h2.title").css({"margin-left":"auto"});
                      $(headList).find("*").each(function(){
                        var css;
                        if (document.defaultView && document.defaultView.getComputedStyle) {
                          css = document.defaultView.getComputedStyle(this, null);
                        } else if (this.currentStyle) {
                          css = this.currentStyle;
                        }else{
                          return;
                        }
                        var style = "";
                        for(var key in css){
                          var isSkip = false;
                          $.each(["width", "height"], function(){
                            if((new RegExp(this)).test(key)){
                              isSkip = true;
                              return false;
                            }
                          });
                          if(isSkip) continue;
                          var value = css[key];
                          var cp = key.replace(/[A-Z]/g, function(){
                            var arg = arguments;
                            return "-" + arg[0].toLowerCase();
                          });
                          style += cp + ":" + value + ";";
                        }
                        $(this).attr("style", style);
                      });
                    })(jQuery);
                  }
                  
                }
              },
              error : function(obj, status, e) {
                var msg = "Ajax Error : " + obj.url;
                Readme.Error = e;
                if(!isWeb) alert(msg);
                throw new Error(msg);
              }
            });
          });

          index.onclick = function() { Readme.makeIndex((isAjax) ? null : key, _isHeadListNumber); };
          index.style.cursor = "pointer";
          //index.style.visibility = "visible";
          index.style.display = "";
          
      }

      if(!isBack && current.last() != key) current.push(key);
      if(select) select.selectedIndex = ($A($("select").options).detect(function(option) { return (option.value == key); }) || { index: 0 }).index;
      if(_terop && _terop.length > 0) Readme.terop(_terop, 1, 20, "terop"); else if(Readme.terop.tid) clearTmeout(Readme.terop.tid);

      //
      // 検索関数
      // 
      function search() {

        var searchText = $("searchText").value;
        if(searchText == "") return;

        var searchResult = $("searchResult");
        searchResult.innerHTML = "";

        $("searchButton").disabled = true;

        var searchType = $A($("searchForm").searchType).detect(function(value) { return (value.checked == true); }).value;
        var ignoreCase = $("searchForm").ignoreCase.checked;

        var regExp;
        var searchWordArray;
        switch(searchType) {
          case "and":
          case "or":
            if(ignoreCase) searchText = searchText.toLowerCase();
            searchWordArray = searchText.split(/[ 　]+/); //半角・全角空白
            break;

          case "regExp":
            try {
              eval("regExp = /" + searchText + "/" + (ignoreCase ? 'i' : '') + ";");
            } catch(e) {
              new Insertion.Bottom(searchResult, "不正な正規表現です。");
              $("searchButton").disabled = false;
              return;
            }
            break;
        }

        var length = 0;
        var hitted = false;
        var searched = 0;

        //$H(pages).each(function(pair) {
        pagesItr.each(function(key) {
          //var key = pair.key;
          if(["_search", "_catalog", "_help"].include(key)) throw $continue;
          //var page = pair.value;
          var page = pages[key];
          var src = page.src || [key];
          var _srcDir = (page.srcDir || srcDir) + ((key && page.src) ? "/" + key : "");
          var _suffix = page.suffix || suffix;

          return src.each(function(_src) {
            length++;
//            new AjaxOrHFT.Request(_srcDir + '/' + _src + _suffix, {
//              onComplete: function(req) {
//                text = req.responseText;
//                var isHit = false;
//                var searchFnc = function(searchWord) { return (text.indexOf(searchWord) != -1) };
//                switch(searchType) {
//                  case "and":
//                    if(searchWordArray.all(searchFnc)) {
//                      isHit = true;
//                    }
//                    break;
//
//                  case "or":
//                    if(searchWordArray.any(searchFnc)) {
//                      isHit = true;
//                    }
//                    break;
//
//                  case "regExp":
//                    if(text.match(regExp)) {
//                      isHit = true;
//                    }
//                    break;
//                }
//
//                if(isHit) {
//                  var match = text.match(/^\*([^\*].*)\[\#(.*)\](?=\r\n)/);
//                  var title = match[1];
//                  var id = match[2];
//                  var result = readWikiSrc("\r\n-[[" + (page.name || page.title || key) + " > " + title + ">" + key + "#" + id + "]]" + ((isWeb) ? "" : "(&ref(" + _srcDir + ");/" + _src + _suffix + ")"));
//                  new Insertion.Bottom(searchResult, result);
//                  hitted++;
//                }
//                searched++;
//              },
//              options: { asynchronous: false },
//              onException: function(obj, e) {
//                //prototype.jsがローカルファイルを必ずevalするため。デバッグ時はコメントアウト。
//                if(e.name.toLowerCase() == "syntaxerror") return;
//                searched++;
//                var msg = "AjaxOrHFT Error : " + obj.url;
//                Readme.Error = e;
//                if(!isWeb) alert(msg);
//                throw new Error(msg);
//              }
//            });
            
            jQuery.ajax({
              cache : false,
              dataType : "text",
              type : "get",
              url : _srcDir + '/' + _src + _suffix,
              async  : false,
              success :function(text) {
                if(ignoreCase) text = text.toLowerCase();
                var isHit = false;
                var searchFnc = function(searchWord) { return (text.indexOf(searchWord) != -1) };
                switch(searchType) {
                  case "and":
                    if(searchWordArray.all(searchFnc)) {
                      isHit = true;
                    }
                    break;

                  case "or":
                    if(searchWordArray.any(searchFnc)) {
                      isHit = true;
                    }
                    break;

                  case "regExp":
                    if(text.match(regExp)) {
                      isHit = true;
                    }
                    break;
                }

                if(isHit) {
                  var match = text.match(/^\*([^\*].*)\[\#(.*)\](?=\r\n)/);
                  var title = match[1];
                  var id = match[2];
                  var result = readWikiSrc("\r\n-[[" + (page.name || page.title || key) + " > " + title + ">" + key + "#" + id + "]]" + ((isWeb) ? "" : "(&ref(" + _srcDir + ");/" + _src + _suffix + ")"));
                  new Insertion.Bottom(searchResult, result);
                  hitted++;
                }
                searched++;
              },
              error : function(obj, status, e) {
                searched++;
                var msg = "Ajax Error : " + obj.url;
                Readme.Error = e;
                if(!isWeb) alert(msg);
                throw new Error(msg);
              }
            });
          });
        });

        var start = new Date().getTime();
        var tid = setInterval(function() {
          if(start - new Date().getTime() > 10 * 1000) {
            new Insertion.Bottom(searchResult, "検索に10秒以上かかっています。監視を中止します。");
            //TODO:検索を中止するロジックを追加する必要あり。
            clearInterval(tid);
            $("searchButton").disabled = false;
            return;
          }
          if(length != searched) return;
          var message = "";
          var _searchText = searchText.replace(/</g, "&lt;").replace(/&/g, "&amp;");

          if(hitted) {
            switch(searchType) {
              case "and":
                message += searchText + " のすべてを含むファイルは";
                break;
              case "or":
                message += searchText + " のいずれかを含むファイルは";
                break;
              case "regExp":
                message += "正規表現 " + searchText + " を含むファイルは";
                break;
            }
            message += length + " ファイル中、 " + hitted + " ファイル見つかりました。"
          } else {
            message = searchText + " を含むファイルは見つかりませんでした。";
          }
          new Insertion.Bottom(searchResult, message);
          clearInterval(tid);
          $("searchButton").disabled = false;
        }, 0.5 * 1000);
      }

      //
      // 一覧作成関数
      // 
      function catalog() {

        var searchResult = $("searchResult");
        searchResult.innerHTML = "";

        var length = 0;
        var hitted = 0;
        var searched = 0;

        //$H(pages).each(function(pair) {
        pagesItr.each(function(key) {
          //var key = pair.key;
          if(["_search", "_catalog", "_help"].include(key)) throw $continue;
          //var page = pair.value;
          var page = pages[key];
          var src = page.src || [key];
          var _srcDir = (page.srcDir || srcDir) + ((key && page.src) ? "/" + key : "");
          var _suffix = page.suffix || suffix;
          
          return src.each(function(_src) {
            length++;
//            new AjaxOrHFT.Request(_srcDir + '/' + _src + _suffix, {
//              onComplete: function(req) {
//                text = req.responseText;
//                var match = text.match(/^\*([^\*].*)\[\#(.*)\](?=\r\n)/);
//                var title = match[1];
//                var id = match[2];
//                var result = readWikiSrc("\r\n-[[" + (page.name || page.title || key) + " > " + title + ">" + key + "#" + id + "]]" + ((isWeb) ? "" : " (&ref(" + _srcDir + ");/" + _src + _suffix + ")"));
//                new Insertion.Bottom(searchResult, result);
//                hitted++;
//                searched++;
//              },
//              options: { asynchronous: false },
//              onException: function(obj, e) {
//                //prototype.jsがローカルファイルを必ずevalするため。デバッグ時はコメントアウト。
//                if(e.name.toLowerCase() == "syntaxerror") return;
//                searched++;
//                var msg = "AjaxOrHFT Error : " + obj.url;
//                Readme.Error = e;
//                if(!isWeb) alert(msg);
//                throw new Error(msg);
//              }
//            });
            jQuery.ajax({
              cache : false,
              dataType : "text",
              type : "get",
              url : _srcDir + '/' + _src + _suffix,
              async  : false,
              success : function(text) {
                var match = text.match(/^\*([^\*].*)\[\#(.*)\](?=\r\n)/);
                var title = match[1];
                var id = match[2];
                var result = readWikiSrc("\r\n-[[" + (page.name || page.title || key) + " > " + title + ">" + key + "#" + id + "]]" + ((isWeb) ? "" : " (&ref(" + _srcDir + ");/" + _src + _suffix + ")"));
                new Insertion.Bottom(searchResult, result);
                hitted++;
                searched++;
              },
              error : function(obj, status, e) {
                searched++;
                var msg = "Ajax Error : " + obj.url;
                Readme.Error = e;
                if(!isWeb) alert(msg);
                throw new Error(msg);
              }
            });
          });
        });

        var start = new Date().getTime();
        var tid = setInterval(function() {
          if(start - new Date().getTime() > 10 * 1000) {
            Element.remove("message");
            new Insertion.Bottom(searchResult, "一覧作成に10秒以上かかっています。監視を中止します。");
            //TODO:検索を中止するロジックを追加する必要あり。
            clearInterval(tid);
            $("searchButton").disabled = false;
            return;
          }
          if(length != searched) return;
          Element.remove("message");
          var message = hitted + " ファイル見つかりました。"
          new Insertion.Bottom(searchResult, message);
          clearInterval(tid);
        }, 0.5 * 1000);
      }

      //
      // ソース変換・表示関数
      //
      function readWikiSrc(text, _srcDir, _srcFile) {

        text = text.replace(/\r(?!\n)/g, "\r\n");
        text = text.replace(/(.)\n/g, function(){
          return (arguments[1] == "\r") ? arguments[0] : arguments[1] + "\r\n";
        });
        
        if(!/.*\r\n$/.test(text)) text += "\r\n";

        //コメント
        //整形済みテキスト内は対象外とする
        text = text.replace(/((?:^|\r\n)(?:[^ ].*?)?)<\!--(?:.*?\r\n)*?.*?-->/g, "$1");
        text = text.replace(/\r\n\/\/.*?(?=\r\n)/g, "");

        //【独自】折りたたみエリア
        text = text.replace(/\r\n<\?--(.*?)\r\n((?:.*?\r\n)*?.*?)\r\n--\?>/g, function(){
          var msg = arguments[1] || "＞＞＞クリックすると表示します＜＜＜";
          return "\r\n\$lt;div class='hiddenArea' onclick='Readme.showHiddenArea(this);'\$gt;\r\n" + msg + "\r\n" + arguments[2] + "\r\n\$lt;/div\$gt;"
        });

        //エスケープ
        text = text.replace(/\r\n(\|{0,2})<(?=\r\n)/g, "\r\n\$1$lt;");
        text = text.replace(/</g, "&lt;");
        text = text.replace(/\$lt;/g, "<");
        text = text.replace(/\$gt;/g, ">");

        //
        // インライン要素(事前処理)
        //

        //for diary
        if(_isDiary) {
          text = text.replace(/\r\n(?=\r\n)/g, "\r\n&nbsp;");
        }

        //改行
        text = text.replace(/~\r\n(?! )/g, "<br/>");

        /*
        * ブロック要素
        */

        //整形済みテキスト 事前変換
        text = text.replace(/\r\n>\|(\|)?(\r\n(?:.|\r\n)*?|)\r\n\1\|<(?=\r\n( |>\|)?)/g, function(){
          return (arguments[1] ? "\r\n |src|" : "\r\n |txt|") + arguments[2].replace(/\r\n/g, "\r\n ") +  (arguments[3] ? "\r\n" : "");
        });

        //左寄せ・センタリング・右寄せ
        text = text.replace(/\r\n(LEFT|CENTER|RIGHT):(.*?)(?=\r\n)/g, "\r\n<p style='text-align:$1'>$2</p>");

        //段落
        text = text.replace(/\r\n([^*\-+|:#>~ <](.*))(?=\r\n)/g, "\r\n<p>$1</p>");
        text = text.replace(/\r\n~(.*)(?=\r\n)/g, "\r\n<p>$1</p>");

        //引用文
        text = text.replace(/\r\n>\r\n((?:.|\r\n)*?)\r\n<(?=\r\n)/g, "\r\n<blockquote>$1</blockquote>");
        text = text.replace(/\r\n>(.*?)(?=\r\n)/g, "\r\n<blockquote>$1</blockquote>");

        //番号なしリスト
        //入れ子対応版 連続行でレベル1から使用される場合のみ。
        text = text.replace(/(\r\n\-[^-].*(?:\r\n\-.*)+)(?=\r\n[^-]|\r\n$|$)/g, function() {
          var str = "\r\n<ul class='list'>";
          str += arguments[1].replace(/\r\n\-(?!\-)(.*?)(?=\r\n|$)/g, "\r\n<li>$1");
          str = str.replace(/((?:\r\n\-.*)+)(?=\r\n[^-]|$)/g, function() {
            var str = "\r\n<ul class='list'>";
            str += arguments[1].replace(/\r\n\-\-(?!\-)(.*?)(?=\r\n|$)/g, "\r\n<li>$1");
            str = str.replace(/((?:\r\n\-.*)+)(?=\r\n[^-]|$)/g, function() {
              var str = "\r\n<ul class='list'>";
              str += arguments[1].replace(/\r\n\-\-\-(?!\-)(.*?)(?=\r\n|$)/g, "\r\n<li>$1");
              str += "</ul>";
              return str;
            });
            str += "</ul>";
            return str;
          });
          str += "</ul>";
          return str;
        });

        //番号なしリスト
        //↑の処理条件に当てはまらないもの
        text = text.replace(/\r\n-([^\-].*)?(?=\r\n)/g, "\r\n<ul class='list'><li>$1</ul>");
        text = text.replace(/\r\n-{2}([^\-].*)?(?=\r\n)/g, "\r\n<ul class='none list'><li><ul class='list'><li>$1</ul></ul>");
        text = text.replace(/\r\n-{3}([^\-].*)?(?=\r\n)/g, "\r\n<ul class='none list'><li><ul class='none list'><li><ul class='list'><li>$1</ul></ul></ul>");

        //番号付きリスト
        //入れ子あり。連続行でレベル1から順番に使用される前提。
        text = text.replace(/((?:\r\n\+.*)+)(?=\r\n[^+]|\r\n$|$)/g, function() {
          var str = "\r\n<ol class='list'>";
          str += arguments[1].replace(/\r\n\+(?!\+)(.*?)(?=\r\n|$)/g, "\r\n<li>$1");
          str = str.replace(/((?:\r\n\+.*)+)(?=\r\n[^+]|$)/g, function() {
            var str = "\r\n<ol class='list'>";
            str += arguments[1].replace(/\r\n\+\+(?!\+)(.*?)(?=\r\n|$)/g, "\r\n<li>$1");
            str = str.replace(/((?:\r\n\+.*)+)(?=\r\n[^+]|$)/g, function() {
              var str = "\r\n<ol class='list'>";
              str += arguments[1].replace(/\r\n\+\+\+(?!\+)(.*?)(?=\r\n|$)/g, "\r\n<li>$1");
              str += "</ol>";
              return str;
            });
            str += "</ol>";
            return str;
          });
          str += "</ol>";
          return str;
        });

        //定義リスト
        text = text.replace(/\r\n\:([^\|]*?)\|(.*?)(?=\r\n)/g, "\r\n<dl><dt>$1</dt><dd>$2</dd></dl>");

        //表組み
        text = text.replace(/(\r\n\|(?:.*?\r\n\|)*?.*?)(?=\r\n[^\|]|\r\n$)/g, function() {
          var str = "\r\n<table>";
          str += arguments[1].replace(/\r\n(\|[^\r\n]*\|)(c)?(?=\r\n|$)/ig, function() {
            var isCol = !!(arguments[2]);
            var _str = isCol ? "" : "<tr>";
            _str += arguments[1].replace(/\|(\~)?(?:((?:(?:LEFT|CENTER|RIGHT|BGCOLOR\(.*?\)|COLOR\(.*?\)|SIZE\(.*?\))?:)+)(\d+)?)?([^|\r\n]*)(?=\|)/ig, function() {
              var args = arguments;
              var __str = isCol ? "<col" : args[1] ? "<th" : "<td";
              if(args[2] != null) {
                var match = args[2].match(/(LEFT|CENTER|RIGHT):/i);
                if(match != null) __str += " ALIGN='" + match[1] + "'";
                __str = ["BGCOLOR", "COLOR", "SIZE"].inject(__str, function(memo, value) {
                  var regExp = new RegExp("(" + value + ")\\((.*?)\\):", "i");
                  var match = args[2].match(regExp);
                  if(match != null) memo += " " + match[1] + "='" + match[2] + "'";
                  return memo;
                });
                if(args[3] != null) __str += " WIDTH='" + args[3] + "'";
              }
              if(isCol) {
                if(!isFirefox) __str += "/>"; //Firefoxバグ?対応
              } else {
                if(!isFirefox) __str += ">"; //Firefoxバグ?対応
                __str += args[4] + (args[1] ? "</th>" : "</td>");
              }
              return __str;
            });
            _str = _str.replace(/\|$/, isCol ? "" : "</tr>");
            return _str;
          });
          return str + "</table>";
        });

        //見出し
        
        //var hl = _isHeadListNumber ? "ol" : "ul";

//        text = text.replace(/^(\*[^\*](?:.|\r\n)*?)(?=\r\n\*{2}(?!\*))/g, "$1\r\n<" + hl + ">");
//        text = text.replace(/(\r\n\*{2}(?!\*)(?:.|\r\n)*?)(?=\r\n\*{2}(?!\*))/g, "$1\r\n</" + hl + ">");
//        text = text.replace(/(\r\n\*{2}(?!\*)(?:.|\r\n)*?)(?=\r\n\*{2}(?!\*))/g, "$1\r\n<" + hl + ">");
//        text = text.replace(/(\r\n\*{3}(?!\*)(?:.|\r\n)*?)(?=\r\n\*{2}?(?!\*))/g, "$1\r\n</" + hl + ">");

//        text = text.replace(/^\*([^\*].*?)\[\#(.*?)\](?=\r\n)/g,
//               "\r\n<span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a>"
//             + ((isWeb) ?  "" : "<br/>[&nbsp;<a href='" + _srcDir + "' target='_blank'>" + _srcDir + "</a>/" + _srcFile + "&nbsp;]") + "</span>"
//             + "<li id='$2'>$1<span class='append'><a class='anchor_super' id='$2' href='?" + key + "#$2'" + " title='$2'>&nbsp;&dagger;&nbsp;</a></span></li>");
//
//        text = text.replace(/\r\n\*+([^\*].*?)\[\#(.*?)\](?=\r\n)/g,
//               "\r\n<span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a></span>"
//             + "<li id='$2'>$1<span class='append'><a class='anchor_super' id='$2' href='?" + key + "#$2'" + " title='$2'>&nbsp;&dagger;&nbsp;</a></span></li>");

//        text = text.replace(/^\*([^\*].*?)\[\#(.*?)\](?=\r\n)/g,
//               "\r\n<li><span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a>"
//             + ((isWeb) ?  "" : "<br/>[&nbsp;<a href='" + _srcDir + "' target='_blank'>" + _srcDir + "</a>/" + _srcFile + "&nbsp;]") + "</span>"
//             + "<div class='title' id='$2'>$1<span class='append'><a class='anchor_super' id='$2' href='?" + key + "#$2'" + " title='$2'>&nbsp;&dagger;&nbsp;</a></span></div>");
//
//        text = text.replace(/\r\n\*+([^\*].*?)\[\#(.*?)\](?=\r\n)/g,
//               "\r\n<li><span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a></span>"
//             + "<div class='title' id='$2'>$1<span class='append'><a class='anchor_super' id='$2' href='?" + key + "#$2'" + " title='$2'>&nbsp;&dagger;&nbsp;</a></span></div>");

//        text = text.replace(/(?:^|\r\n)(\*+)([^\*].*)\[\#(.*)\](?=$|\r\n)/g, function(){
//          var tagName = "h" + arguments[1].length;
//          var str = "\r\n";
//          if(arguments[1].length != 1) str += "<a class='goTop' href='#title'>↑</a>";
//          return str + "<" + tagName + " id='" + arguments[3] + "'>" + arguments[2] + "</" + tagName + ">";
//        });

        var hl = "section";

        text = text.replace(/(\r\n\*{3}(?!\*)(?:.|\r\n)*?)(?=\r\n\*{1,3}[^*]|$)/g, "$1\r\n</" + hl + ">");
        text = text.replace(/(\r\n\*{3})(?!\*)/g, "\r\n<" + hl + ">$1");

        text = text.replace(/(\r\n\*{2}(?!\*)(?:.|\r\n)*?)(?=\r\n\*{1,2}[^*]|$)/g, "$1\r\n</" + hl + ">");
        text = text.replace(/(\r\n\*{2})(?!\*)/g, "\r\n<" + hl + ">$1");

        if(isSimple){
          text = text.replace(/(?:^|\r\n)(\*{1}(?!\*)(?:.|\r\n)*?)(?=\r\n\*{1}[^*]|$)/g, "<" + hl + ">\r\n$1\r\n</" + hl + ">");
        }else{
          text = text.replace(/^(\*{1}(?!\*)(?:.|\r\n)*?)$/g, "<" + hl + ">\r\n$1\r\n</" + hl + ">");
        }
        text = text.replace(/^(\*{1}(?!\*)(?:.|\r\n)*?)$/g, "<" + hl + ">\r\n$1\r\n</" + hl + ">");

        text = text.replace(/\r\n(\*+)([^\*].*?)(\[\#(.*?)\])?(?=\r\n)/g, function(){
             var arg = arguments;
             if(!isSimple && arg[3] == null) return arg[0];
             return "\r\n<header>"
               + ((isSimple || _isForPaste) ? "" 
                 : "<span class='navi'><a class='goTop' href='" + ((isAjax) ? "#title" : getRedirect(key + "#title")) + "'>&nbsp;↑&nbsp;</a>"
                 + ((isWeb || arg[1].length > 1) ?  "" : "<br/>[&nbsp;<a href='" + _srcDir + "' target='_blank'>" + _srcDir + "</a>/" + _srcFile + "&nbsp;]") + "</span>")
               + "<h2 class='title'" + ((arg[4]) ? " id='" + arg[4] + "'" : "") + ">" + arg[2]
               + ((arg[3] && !_isForPaste) ? "<span class='append'><a class='anchor_super' id='" + arg[4] + "' href='?" + key + "#" + arg[4] + "'" + " title='" + arg[4] + "'>&nbsp;&dagger;&nbsp;</a></span>" : "")
               + "</h2></header>";
        });
        
        //目次(削除)
        text = text.replace(/#contents;?/g, "");

        //水平線
        text = text.replace(/\r\n[\-]{4,}/g, "\r\n<hr/>");
        text = text.replace(/\r\n#hr;?(?=\r\n)/g, "\r\n<hr class='middle'/>");

        //行間開け
        text = text.replace(/\r\n#br;?(?=\r\n)/g, "\r\n<br/>");

        //添付ファイル・画像の貼り付け
        text = text.replace(/(\r\n#)ref\(([^,]+?)((?:,[^,]+?)+)?\);?(?=\r\n)/g, replaceForAttach);

        //テキストの回り込みの解除
        text = text.replace(/\r\n#clear;?/g, "\r\n<div class='clear'></div>");

        //整形済みテキスト
        text = text.replace(/\r\n(?: \|(txt|src)\|\r\n)?( (?:.*?\r\n )*?.*?)(?=\r\n[^ ]|\r\n$)/g, function() {
          var type = arguments[1];
          var src = arguments[2];
          src = src.replace(/(^|\r\n) /g, "$1");
          if(_prettyPrint && (_defaultPrettyPrint && (type != "txt")) || (!_defaultPrettyPrint && (type == "src"))) {
            return "\r\n<pre class='prettyprint'>" + src + "</pre>";
          } else {
            return "\r\n<pre>" + src + "</pre>";
          }
        });

        /*
         * インライン要素
         */
        //リンク
        text = text.replace(/(^|[&#]ref\( *|[^:])((?:https?|ftp|news):\/\/(?:[^:\/<'" \r\n]+)(?::(?:\d+))?(?:\/[^<'" \r\n]*)?)/ig, function() {
          if(arguments[1].match(/^[&#]ref\( *$/)) return arguments[0];
          var url = arguments[2];
          if(url.match(/.*\.(?:bmp|png|jpg|jpeg|gif)$/)) {
            //TODO:spanで囲う等しないと行頭に記述されたときに表示されない。残課題。
            return arguments[1] + "<span><img src='" + url + "' alt='" + url + "'/></span>";
          } else {
            return arguments[1] + "<a href='" + url + "' target='_blank'>" + url + "</a>";
          }
        });
        text = text.replace(/(:)?([\w!#$%&'*+\/=?^`{|}~\-](?:[\w!#$%&'*+/=?^`{|}~\-]|\.(?=[\w!#$%&'*+/=?^`{|}~\-])){0,63}@(?:[a-z]\.|[a-z][a-z0-9\-]*[a-z0-9]\.)+(?:aero|biz|com|coop|info|musenjum|name|net|org|pro|jobs|travle|arpa|edu|gov|int|mil|nato|[a-z]{2}))/g,
          function(){
            if(arguments[1]) return arguments[0];
            return "<a href='mailto:" + arguments[2] + "'>" + arguments[2] + "</a>";
          }
        );

        text = text.replace(/\[\[(.+?)\]\]/g, function() {
          var regExp1 = /^([^:#]+?):(.+)$/;
          var regExp2 = /^(?:([^:#]+)>)?(([^#]+?)?(#.+)?)$/;
          var args = arguments;
          if(regExp1.test(args[1])) {
            return args[1].replace(regExp1, function() {
              var _args = arguments;
              return "<a href='" + _args[2] + "' target='_blank'>" + _args[1] + "</a>";
            });
          } else if(regExp2.test(args[1])) {
            return args[1].replace(regExp2, function() {
              var _args = arguments;
              var address, str, onclick;
              str = _args[1] || _args[2];
              if(isAjax) {
                address = (_args[4] || "javascript:void(0);");
                onclick = (_args[3]) ? "onclick='__readme.writePage(\"" + _args[3] + "\");'" : "";
              } else {
                address = getRedirect((_args[3] || key) + (_args[4] || ""));
                onclick = "";
              }
              return "<a " + onclick + " href='" + address + "'>" + str + "</a>";
            });
          } else {
            return "<a href='" + args[1] + "'>" + args[1] + "</a>";
          }
        });

        //添付ファイル・画像の貼り付け
        text = text.replace(/(\&)ref\(([^,]+?)((?:,[^,]+?)+)?\);/g, replaceForAttach);

        //改行
        text = text.replace(/&br;/g, "<br/>");
        //text = text.replace(/\r\n(?=\r\n)/g, "\r\n<br/>");

        //強調・斜体
        text = text.replace(/([^'])'''(.+?)'''(?=[^'])/g, "$1<i>$2</i>");
        text = text.replace(/([^'])''(.+?)''(?=[^'])/g, "$1<b>$2</b>");

        //文字サイズ(入れ子になっても結果的に問題なし)
        text = text.replace(/&size\((\d+)\)\{(.+?)\};/g, "<span style='font-size:$1px;'>$2</span>");

        //文字色(入れ子になっても結果的に問題なし)
        text = text.replace(/&color\(([^,)]*)(?:,\s*([^)]+))?\)\{(.+?)\};/g, "<span style='color:$1;background-color:$2;'>$3</span>");

        //取消線
        text = text.replace(/%%(.+?)%%/g, "<del>$1</del>");

        //注釈
        text = text.replace(/\(\((.+?)\)\)/g, "<span title='$1' style='cursor:pointer;'>(*)</span>");

        //文字参照文字
        text = text.replace(/&heart;/g, "<img src='staff/heart.png' class='icon' />");
        text = text.replace(/&smile;/g, "<img src='staff/smile.png' class='icon' />");
        text = text.replace(/&bigsmile;/g, "<img src='staff/bigsmile.png' class='icon'/>");
        text = text.replace(/&huh;/g, "<img src='staff/huh.png' class='icon' />");
        text = text.replace(/&oh;/g, "<img src='staff/oh.png' class='icon '/>");
        text = text.replace(/&wink;/g, "<img src='staff/wink.png' class='icon' />");
        text = text.replace(/&sad;/g, "<img src='staff/sad.png' class='icon'/>");
        text = text.replace(/&worried;/g, "<img src='staff/worried.png' class='icon'/>");

        text = text.replace(/&apos;/g, "'");
        //text = text.replace(/&/g, "&amp;");

        return text;

        /**
        * 添付ファイル・画像の貼り付け用内部関数
        */
        //TODO 見直しが必要。
        function replaceForAttach() {
          var str = "";
          var repStr = null;
          var otherSrcDir = null;
          var isBlock = (arguments[1] == "\r\n#");
          var url = arguments[2];
          var isSvRoot = /^(?:[\\\/]|(?:https?|ftp|news|file):\/\/)/.test(url);
          var isApRoot = /^\~[\\\/]/.test(url);
          var param = arguments[3];
          if(param != null) {
            var optionRegex = /^ *(nolink|around|left|center|right|wrap|nowrap|(\d+)(?=x(\d+))?) *$/i;

            var match = param.match(/(,)?, *([^,]+) *$/);
            if(match) {
              if(match[1] || !match[2].match(optionRegex)) {
                repStr = match[2];
              }
            }

            match = param.match(/^ *,([^,)]+?) */);
            if(match) {
              if(!match[1].match(optionRegex)) {
                var page = pages[match[1]];
                if(page) {
                  otherSrcDir = (page.srcDir || srcDir) + ((match[1] && page.src) ? "/" + match[1] : "");
                }
              }
            }
          }

          var isImg = (!repStr && (/.+?\.(?:bmp|png|jpg|jpeg|gif)/i).test(url));
          var isNolink = (param && (/(?:,|^) *nolink *(?=,|$)/i).test(param));
          var isNoimg = (param && (/(?:,|^) *noimg *(?=,|$)/i).test(param));
          if(isImg) {
            var imgUrl;
            if(_isRefFromSrc) {
              if(isSvRoot) {
                imgUrl = url;
              } else if(isApRoot) {
                imgUrl = url.substr(2);
              } else {
                if(otherSrcDir) {
                  imgUrl = otherSrcDir + "/" + url;
                } else {
                  imgUrl = _srcDir + "/" + url;
                }
              }
            } else {
              imgUrl = _imgDir + "/" + url;
            }
            str += (isNolink ? "" : "<a target='_blank' href='" + imgUrl + "'>")
                + "<img src='" + imgUrl + "'" + (isBlock ? " class='block'" : "")
                + " alt='" + (repStr || imgUrl) + "'"
                + " style='";
          } else {
            str += isBlock ? "<p style='" : "<a target='_blank' style='";
          }

          if(param) {
            var isFloat = (/(?:,|^) *(around) *(?=,|$)/i).test(param);
            var match = param.match(/(?:,|^) *(left|center|right) *(?=,|$)/i);
            if(match) {
              if(isImg) {
                if(match[1].toLowerCase() == "left") {
                  if(isFloat) {
                    str += "float:left;"
                  } else {
                    str += "margin:auto auto auto 0px;"
                  }
                } else if(match[1].toLowerCase() == "right") {
                  if(isFloat) {
                    str += "float:right;"
                  } else {
                    str += "margin:auto 0px auto auto;"
                  }
                } else if(match[1].toLowerCase() == "center") {
                  str += "margin:auto;"
                }
              } else {
                str += "text-align:" + match[1] + ";"
              }
            } else {
              if(isImg) {
                str += "margin:auto;"
              } else {
                str += "text-align:center;"
              }
            }

            match = param.match(/(?:,|^) *(\d+)(?:x(\d+))? *(?=,|$)/i);
            if(match) {
              str += "width:" + match[1] + "px;";
              if(match[2]) str += "height:" + match[2] + "px;";
            }
          }
          if(param == null || (/(?:,|^) *wrap *(?=,|$)/i).test(param) == false) {
            str += "border-style:none;";
          }
          if(isImg) {
            str += "'/>" + (isNolink ? "" : "<\/a>");
          } else {
            var href;
            if(_isRefFromSrc) {
              if(isSvRoot) {
                href = url;
              } else if(isApRoot) {
                href = url.substr(2);
              } else {
                if(otherSrcDir) {
                  href = otherSrcDir + "/" + url;
                } else {
                  href = _srcDir + "/" + url;
                }
              }
            } else {
              href = url;
            }
            str += "'>" + (isNolink ? "" : "<a target='_blank' href='" + href + "'>")
                + (isNoimg ? "" : "<img src='staff/file.png' class='icon' />")
                + (repStr || url) + (isNolink ? "" : "<\/a>") + (isBlock ? "<\/p>" : "");
          }
          return str;
        }
      }
    }

    function backPage() {
      if(current.length > 0) {
        current.pop();
        writePage(current.last(), true)
      }
    }

    function reloadPage() {
      if(current.length > 0) {
        writePage(current.last(), true)
      }
    }

    function getRedirect(param) {
      return locationPage + encodeURIComponent(param);
    }
    
  },

  insertValue: function(tagName, id, value) {
    var obj = document.getElementsByTagName(tagName);
    for(var i = 0; i < obj.length; i++) {
      if(obj[i].id == id) {
        obj[i].innerHTML = value;
      }
    }
  }
};

Readme.showHiddenArea = function(elm){
  new Element.ClassNames(elm).remove('hiddenArea');
  elm.onclick = null;
};

Readme.makeIndex = function(key, isHeadListNumber) {
  var defaultPage = key ? "?" + key : "";
  var indexObj = $("index");
  //var hl = isHeadListNumber ? "ol" : "ul";
  var hl = "section";
  var arrayOl = document.getElementsByTagName(hl);
  var obj = getOlObj(arrayOl);
  //var obj = jQuery('#base').children(hl);
  var idIndex = 0;

  indexObj.innerHTML = "<h3>目次</h3>" + _make(obj);
  indexObj.style.cursor = "";
  indexObj.onclick = null;
  new Insertion.After(indexObj, "<div class='end'></div>");
  Element.removeClassName(indexObj, 'notPrint');

  function _make(obj) {
    var indexStr = "<ul>";
    //for(var i = 0; i < obj.childNodes.length; i++) {
    $A(obj.childNodes).each(function(child) {
      if(!child.tagName) throw $continue;
      if(child.tagName.toLowerCase() == "section") {
        var title = jQuery(child).find("h2.title").get(0);
        if(title.id == null || title.id == "") {
          title.id = "Readme_makeIndex_" + idIndex++;
        }
        var childValue = title.innerHTML.replace(/<span +class *= *(['"])?append\1 *>.+< *\/ *span *>$/i, "").unescapeHTML();
        indexStr += "<li><div class='title'><a href='" + defaultPage + "#" + title.id + "'>" + childValue + "</a></div></li>";
      }
      var childOlObj = null;
      if(child.tagName.toLowerCase() == hl && child.className != "list") {
        childOlObj = child;
      } else {
        childOlObj = getOlObj(child.childNodes);
      }
      if(childOlObj != null) {
        indexStr = indexStr + _make(childOlObj);
        childOlObj = null;
      }
    });
    indexStr += "</ul>";
    return indexStr;
  }
  function getOlObj(elmArray) {
    return $A(elmArray).find(function(elm) { return (elm.tagName && elm.tagName.toLowerCase() == hl && elm.className != "list") });
  }

//  //何故かIE9で動かず・・・。
//  function _make(obj) {
//    var indexStr = "";
//    indexStr += "<" + hl + ">";
//    obj.children("li").each(function(){
//      var li = jQuery(this);
//      var title = li.find("div.title").get(0);
//      if(title.id == null || title.id == "") {
//        title.id = "Readme.makeIndex." + idIndex++;
//      }
//      var titleValue = title.innerHTML.replace(/<span +class *= *(['"])?append\1 *>.+< *\/ *span *>$/i, "").unescapeHTML();
//      indexStr += "<li><a href='" + defaultPage + "#" + title.id + "'>" + titleValue + "</a></li>";
//      var l = li.children(hl + ":not(.list)");
//      if(l.size() != 0) indexStr += _make(l);
//    });
//    indexStr += "</" + hl + ">";
//    return indexStr;
//  }
}

Readme.terop = function(msgs, len, time, id){
  var base = document.getElementById(id);
  if(Readme.terop.tid != null){
    clearTimeout(Readme.terop.tid);
    base.removeChild(Readme.terop.msg);
    Readme.terop.msg = null;
    Readme.terop.tid = null;
  }
  var stylePosition = Element.getStyle(base, "position");
  if(stylePosition == "" || stylePosition == "static"){
    base.style.position = "relative";
  }
  var styleWidth = Element.getStyle(base, "width");
  if(styleWidth == "" || styleWidth == "auto"){
    base.style.width = "100%";
  }
  base.style.overflow = 'hidden';
  var msg = Readme.terop.msg = document.createElement("span");
  base.appendChild(msg);
  msg.style.position = "relative";
  msg.style.left = (base.offsetWidth + 1) + "px";
  msg.style.whiteSpace = "nowrap";
  var i = 0;
  if(typeof(msgs[i]) == "function"){
    msg.innerHTML = msgs[i]();
  }else{
    msg.innerHTML = msgs[i];
  }
  var move = function(){
    if(parseInt(msg.style.left) < -(msg.offsetWidth)){
      msg.style.left = (base.offsetWidth + 1) + "px";
      i++;
      if(i >= msgs.length) i = 0;
      if(typeof(msgs[i]) == "function"){
        msg.innerHTML = msgs[i]();
      }else{
        msg.innerHTML = msgs[i];
      }
    }
    msg.style.left = (parseInt(msg.style.left) - len) + "px";
    Readme.terop.tid = setTimeout(move, time);
  };
  move();
};
Readme.terop.tid = null;

Readme.debug = function(message){
  if(!Readme.debug.isValid) return;
  var div = document.getElementById("Readme_debug");
  if (div == null) {
    div = document.createElement('div');
    div.id = "Readme_debug";
    div.style.backgroundColor = "#ffff99";
    document.body.appendChild(div);
  }
  div.innerHTML += message + "<br />";
};
Readme.debug.isValid = false;

Readme.T = function(time, message) {
  return function() {
    var dif;
    if(typeof (time) == "string") {
      dif = new Date(time).getTime() - new Date().getTime();
    } else if(time instanceof Date) {
      dif = time.getTime() - new Date().getTime();
    }
    return message + "&nbsp;" +
      (
        (dif < 0)
        ? "<b>！！！予定を過ぎています！！！</b>"
        : (
            (dif < 1 * 60 * 60 * 1000)
            ? "<b>！！あと" + Math.round(dif / 60 / 1000) + "分！！</b>"
            : (
                (dif < 1 * 24 * 60 * 60 * 1000)
                ? "<b>！あと" + Math.round(dif / 60 / 60 / 1000) + "時間！</b>"
                : "あと" + Math.round(dif / 24 / 60 / 60 / 1000) + "日"
              )
          )
      );
  };
};