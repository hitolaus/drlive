/*! Boxee DR Live TV/DR NU, v1.0.0 build: 2012-09-30 Copyright (c) 2012 Jakob Hilarius; */


var defineBoxeeControlFunctions = function () {
  function setApiMinVersion(args) {
    version = args[0];
    boxee.apiMinVersion = version || 7.0;
  }
  boxee.exec(setApiMinVersion);

  function showNotification(args) {
    var message = args[0];
    var thumbUrl = args[1] || '.';
    var duration = args[2] || 2;
    
    boxee.showNotification(message, thumbUrl, duration);
  }
  boxee.exec(showNotification);

  function cursorMode() {
    boxee.setMode(boxee.CURSOR_MODE);
  }
  boxee.exec(cursorMode);

  function keyboardMode() {
    boxee.setMode(boxee.KEYBOARD_MODE);
  }
  boxee.exec(keyboardMode);
  
  function getHttp(args) {
    url = args[0];
    return boxee.getHttp(url);  
  }
  boxee.exec(getHttp);
  
  function openDialogCallback(confirmed) {
    browser.execute("window." + boxee.browserCallback + "(" + confirmed + ")");
  }
  boxee.exec(openDialogCallback);
  
  function promptDialog(args) {
    var title = args[0];
    var moreText = args[1] || '';
    
    boxee.browserCallback = args[2];
    
    boxee.openDialog("YesNo", title, moreText, 'openDialogCallback');
  }
  boxee.exec(promptDialog);
}

if (!window.boxee) {
  window.boxee = {
    fake: true,
    exec: function(string) {
      console.log("boxee.exec : " + string);
    },
    exec2: function(string) {
      console.log("boxee.exec2 : " + string);
      return '';
    }
  }
} else {
  defineBoxeeControlFunctions();
}

window.boxeeAPI = {
  
  notify: function(message, seconds) {
    seconds = seconds ? seconds : 2;    
    var json = JSON.stringify([message, ".", seconds]);
    boxee.exec('showNotification(' + json + ')');
  },
  closeBrowser: function() {
    boxee.exec("browser.shutdown()");
  },
  closeApp: function() {
    boxee.exec("browser.shutdown()");
  },
  showBoxeeOSD: function() {
    boxee.exec("boxee.showBoxeeOSD()");
  },
  getURL: function(url, callback) {
    return $.Deferred(function(dfd) {
      var json = JSON.stringify([url]);
      var data = boxee.exec2("getHttp(" + json + ")");
      setTimeout(function() {
        dfd.resolve();
        callback(data);
      }, 0);
    }).promise();
  },
  clearPauseOverlay: function() {
    boxee.exec("playerState.isPaused = false;");
  },
  showPauseOverlay: function() {
    boxee.exec("playerState.isPaused = true;");
  },
  keyboardMode: function() {
    boxee.exec("keyboardMode()");
  },
  cursorMode: function() {
    boxee.exec("cursorMode()");
  },
  showNotification: function() {
    var array = Array.prototype.slice.call(arguments);
    var json = JSON.stringify(array);
    boxee.exec("showNotification(" + json + ")");
  },
  promptDialog: function(title, moreText, callback) {
    if (typeof callback === 'function') {
      boxee.promptDialogCallback = function(confirmed) {
        callback(confirmed);
      }
      var json = JSON.stringify([title, moreText, 'boxee.promptDialogCallback']);
      boxee.exec("promptDialog(" + json + ")");
    } else if (typeof callback === 'string') {
      var array = Array.prototype.slice.call(arguments);
      var json = JSON.stringify(array);
      boxee.exec("promptDialog(" + json + ")");
    }
  }
};

$(window).unload(function() {
  boxee.clearPauseOverlay()
});
/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path    ? '; path=' + options.path : '',
                options.domain  ? '; domain=' + options.domain : '',
                options.secure  ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);

if(typeof jwplayer=="undefined"){var jwplayer=function(a){if(jwplayer.api){return jwplayer.api.selectPlayer(a)}};var $jw=jwplayer;jwplayer.version="5.6.1768";(function(b){b.utils=function(){};b.utils.typeOf=function(d){var c=typeof d;if(c==="object"){if(d){if(d instanceof Array){c="array"}}else{c="null"}}return c};b.utils.extend=function(){var c=b.utils.extend["arguments"];if(c.length>1){for(var e=1;e<c.length;e++){for(var d in c[e]){c[0][d]=c[e][d]}}return c[0]}return null};b.utils.clone=function(f){var c;var d=b.utils.clone["arguments"];if(d.length==1){switch(b.utils.typeOf(d[0])){case"object":c={};for(var e in d[0]){c[e]=b.utils.clone(d[0][e])}break;case"array":c=[];for(var e in d[0]){c[e]=b.utils.clone(d[0][e])}break;default:return d[0];break}}return c};b.utils.extension=function(c){c=c.substring(c.lastIndexOf("/")+1,c.length);c=c.split("?")[0];if(c.lastIndexOf(".")>-1){return c.substr(c.lastIndexOf(".")+1,c.length).toLowerCase()}return};b.utils.html=function(c,d){c.innerHTML=d};b.utils.wrap=function(c,d){c.parentNode.replaceChild(d,c);d.appendChild(c)};b.utils.ajax=function(g,f,c){var e;if(window.XMLHttpRequest){e=new XMLHttpRequest()}else{e=new ActiveXObject("Microsoft.XMLHTTP")}e.onreadystatechange=function(){if(e.readyState===4){if(e.status===200){if(f){f(e)}}else{if(c){c(g)}}}};try{e.open("GET",g,true);e.send(null)}catch(d){if(c){c(g)}}return e};b.utils.load=function(d,e,c){d.onreadystatechange=function(){if(d.readyState===4){if(d.status===200){if(e){e()}}else{if(c){c()}}}}};b.utils.find=function(d,c){return d.getElementsByTagName(c)};b.utils.append=function(c,d){c.appendChild(d)};b.utils.isIE=function(){return((!+"\v1")||(typeof window.ActiveXObject!="undefined"))};b.utils.isLegacyAndroid=function(){var c=navigator.userAgent.toLowerCase();return(c.match(/android 2.[012]/i)!==null)};b.utils.isIOS=function(){var c=navigator.userAgent.toLowerCase();return(c.match(/iP(hone|ad)/i)!==null)};b.utils.getFirstPlaylistItemFromConfig=function(c){var d={};var e;if(c.playlist&&c.playlist.length){e=c.playlist[0]}else{e=c}d.file=e.file;d.levels=e.levels;d.streamer=e.streamer;d.playlistfile=e.playlistfile;d.provider=e.provider;if(!d.provider){if(d.file&&(d.file.toLowerCase().indexOf("youtube.com")>-1||d.file.toLowerCase().indexOf("youtu.be")>-1)){d.provider="youtube"}if(d.streamer&&d.streamer.toLowerCase().indexOf("rtmp://")==0){d.provider="rtmp"}if(e.type){d.provider=e.type.toLowerCase()}}return d};b.utils.getOuterHTML=function(d){if(d.outerHTML){return d.outerHTML}else{var e=d.parentNode;var c=document.createElement(e.tagName);var g=document.createElement(d.tagName);e.replaceChild(g,d);c.appendChild(d);var f=c.innerHTML;e.replaceChild(d,g);return f}};b.utils.setOuterHTML=function(f,e){if(f.outerHTML){f.outerHTML=e}else{var g=document.createElement("div");g.innerHTML=e;var c=document.createRange();c.selectNodeContents(g);var d=c.extractContents();f.parentNode.insertBefore(d,f);f.parentNode.removeChild(f)}};b.utils.hasFlash=function(){if(typeof navigator.plugins!="undefined"&&typeof navigator.plugins["Shockwave Flash"]!="undefined"){return true}if(typeof window.ActiveXObject!="undefined"){try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash");return true}catch(c){}}return false};b.utils.getPluginName=function(c){if(c.lastIndexOf("/")>=0){c=c.substring(c.lastIndexOf("/")+1,c.length)}if(c.lastIndexOf("-")>=0){c=c.substring(0,c.lastIndexOf("-"))}if(c.lastIndexOf(".swf")>=0){c=c.substring(0,c.lastIndexOf(".swf"))}if(c.lastIndexOf(".js")>=0){c=c.substring(0,c.lastIndexOf(".js"))}return c};b.utils.getPluginVersion=function(c){if(c.lastIndexOf("-")>=0){if(c.lastIndexOf(".js")>=0){return c.substring(c.lastIndexOf("-")+1,c.lastIndexOf(".js"))}else{if(c.lastIndexOf(".swf")>=0){return c.substring(c.lastIndexOf("-")+1,c.lastIndexOf(".swf"))}else{return c.substring(c.lastIndexOf("-")+1)}}}return""};b.utils.getAbsolutePath=function(j,h){if(h===undefined){h=document.location.href}if(j===undefined){return undefined}if(a(j)){return j}var k=h.substring(0,h.indexOf("://")+3);var g=h.substring(k.length,h.indexOf("/",k.length+1));var d;if(j.indexOf("/")===0){d=j.split("/")}else{var e=h.split("?")[0];e=e.substring(k.length+g.length+1,e.lastIndexOf("/"));d=e.split("/").concat(j.split("/"))}var c=[];for(var f=0;f<d.length;f++){if(!d[f]||d[f]===undefined||d[f]=="."){continue}else{if(d[f]==".."){c.pop()}else{c.push(d[f])}}}return k+g+"/"+c.join("/")};function a(d){if(d===null){return}var e=d.indexOf("://");var c=d.indexOf("?");return(e>0&&(c<0||(c>e)))}b.utils.pluginPathType={ABSOLUTE:"ABSOLUTE",RELATIVE:"RELATIVE",CDN:"CDN"};b.utils.getPluginPathType=function(d){if(typeof d!="string"){return}d=d.split("?")[0];var e=d.indexOf("://");if(e>0){return b.utils.pluginPathType.ABSOLUTE}var c=d.indexOf("/");var f=b.utils.extension(d);if(e<0&&c<0&&(!f||!isNaN(f))){return b.utils.pluginPathType.CDN}return b.utils.pluginPathType.RELATIVE};b.utils.mapEmpty=function(c){for(var d in c){return false}return true};b.utils.mapLength=function(d){var c=0;for(var e in d){c++}return c};b.utils.log=function(d,c){if(typeof console!="undefined"&&typeof console.log!="undefined"){if(c){console.log(d,c)}else{console.log(d)}}};b.utils.css=function(d,g,c){if(d!==undefined){for(var e in g){try{if(typeof g[e]==="undefined"){continue}else{if(typeof g[e]=="number"&&!(e=="zIndex"||e=="opacity")){if(isNaN(g[e])){continue}if(e.match(/color/i)){g[e]="#"+b.utils.strings.pad(g[e].toString(16),6)}else{g[e]=Math.ceil(g[e])+"px"}}}d.style[e]=g[e]}catch(f){}}}};b.utils.isYouTube=function(c){return(c.indexOf("youtube.com")>-1||c.indexOf("youtu.be")>-1)};b.utils.transform=function(c,d){c.style.webkitTransform=d;c.style.MozTransform=d;c.style.OTransform=d};b.utils.stretch=function(h,m,l,f,k,g){if(typeof l=="undefined"||typeof f=="undefined"||typeof k=="undefined"||typeof g=="undefined"){return}var d=l/k;var e=f/g;var j=0;var i=0;m.style.overflow="hidden";b.utils.transform(m,"");var c={};switch(h.toUpperCase()){case b.utils.stretching.NONE:c.width=k;c.height=g;break;case b.utils.stretching.UNIFORM:if(d>e){c.width=k*e;c.height=g*e}else{c.width=k*d;c.height=g*d}break;case b.utils.stretching.FILL:if(d>e){c.width=k*d;c.height=g*d}else{c.width=k*e;c.height=g*e}break;case b.utils.stretching.EXACTFIT:b.utils.transform(m,["scale(",d,",",e,")"," translate(0px,0px)"].join(""));c.width=k;c.height=g;break;default:break}c.top=(f-c.height)/2;c.left=(l-c.width)/2;b.utils.css(m,c)};b.utils.stretching={NONE:"NONE",FILL:"FILL",UNIFORM:"UNIFORM",EXACTFIT:"EXACTFIT"};b.utils.deepReplaceKeyName=function(h,e,c){switch(b.utils.typeOf(h)){case"array":for(var g=0;g<h.length;g++){h[g]=b.utils.deepReplaceKeyName(h[g],e,c)}break;case"object":for(var f in h){var d=f.replace(new RegExp(e,"g"),c);h[d]=b.utils.deepReplaceKeyName(h[f],e,c);if(f!=d){delete h[f]}}break}return h};b.utils.isInArray=function(e,d){if(!(e)||!(e instanceof Array)){return false}for(var c=0;c<e.length;c++){if(d===e[c]){return true}}return false}})(jwplayer);(function(a){a.events=function(){};a.events.COMPLETE="COMPLETE";a.events.ERROR="ERROR"})(jwplayer);(function(jwplayer){jwplayer.events.eventdispatcher=function(debug){var _debug=debug;var _listeners;var _globallisteners;this.resetEventListeners=function(){_listeners={};_globallisteners=[]};this.resetEventListeners();this.addEventListener=function(type,listener,count){try{if(_listeners[type]===undefined){_listeners[type]=[]}if(typeof(listener)=="string"){eval("listener = "+listener)}_listeners[type].push({listener:listener,count:count})}catch(err){jwplayer.utils.log("error",err)}return false};this.removeEventListener=function(type,listener){try{for(var listenerIndex=0;listenerIndex<_listeners[type].length;listenerIndex++){if(_listeners[type][lisenterIndex].toString()==listener.toString()){_listeners[type].slice(lisenterIndex,lisenterIndex+1);break}}}catch(err){jwplayer.utils.log("error",err)}return false};this.addGlobalListener=function(listener,count){try{if(typeof(listener)=="string"){eval("listener = "+listener)}_globallisteners.push({listener:listener,count:count})}catch(err){jwplayer.utils.log("error",err)}return false};this.removeGlobalListener=function(listener){try{for(var globalListenerIndex=0;globalListenerIndex<_globallisteners.length;globalListenerIndex++){if(_globallisteners[globalListenerIndex].toString()==listener.toString()){_globallisteners.slice(globalListenerIndex,globalListenerIndex+1);break}}}catch(err){jwplayer.utils.log("error",err)}return false};this.sendEvent=function(type,data){if(data===undefined){data={}}if(_debug){jwplayer.utils.log(type,data)}if(typeof _listeners[type]!="undefined"){for(var listenerIndex=0;listenerIndex<_listeners[type].length;listenerIndex++){try{_listeners[type][listenerIndex].listener(data)}catch(err){jwplayer.utils.log("There was an error while handling a listener: "+err.toString(),_listeners[type][listenerIndex].listener)}if(_listeners[type][listenerIndex]){if(_listeners[type][listenerIndex].count===1){delete _listeners[type][listenerIndex]}else{if(_listeners[type][listenerIndex].count>0){_listeners[type][listenerIndex].count=_listeners[type][listenerIndex].count-1}}}}}for(var globalListenerIndex=0;globalListenerIndex<_globallisteners.length;globalListenerIndex++){try{_globallisteners[globalListenerIndex].listener(data)}catch(err){jwplayer.utils.log("There was an error while handling a listener: "+err.toString(),_globallisteners[globalListenerIndex].listener)}if(_globallisteners[globalListenerIndex]){if(_globallisteners[globalListenerIndex].count===1){delete _globallisteners[globalListenerIndex]}else{if(_globallisteners[globalListenerIndex].count>0){_globallisteners[globalListenerIndex].count=_globallisteners[globalListenerIndex].count-1}}}}}}})(jwplayer);(function(a){var b={};a.utils.animations=function(){};a.utils.animations.transform=function(c,d){c.style.webkitTransform=d;c.style.MozTransform=d;c.style.OTransform=d;c.style.msTransform=d};a.utils.animations.transformOrigin=function(c,d){c.style.webkitTransformOrigin=d;c.style.MozTransformOrigin=d;c.style.OTransformOrigin=d;c.style.msTransformOrigin=d};a.utils.animations.rotate=function(c,d){a.utils.animations.transform(c,["rotate(",d,"deg)"].join(""))};a.utils.cancelAnimation=function(c){delete b[c.id]};a.utils.fadeTo=function(l,f,e,i,h,d){if(b[l.id]!=d&&d!==undefined){return}var c=new Date().getTime();if(d>c){setTimeout(function(){a.utils.fadeTo(l,f,e,i,0,d)},d-c)}l.style.display="block";if(i===undefined){i=l.style.opacity===""?1:l.style.opacity}if(l.style.opacity==f&&l.style.opacity!==""&&d!==undefined){if(f===0){l.style.display="none"}return}if(d===undefined){d=c;b[l.id]=d}if(h===undefined){h=0}var j=(c-d)/(e*1000);j=j>1?1:j;var k=f-i;var g=i+(j*k);if(g>1){g=1}else{if(g<0){g=0}}l.style.opacity=g;if(h>0){b[l.id]=d+h*1000;a.utils.fadeTo(l,f,e,i,0,b[l.id]);return}setTimeout(function(){a.utils.fadeTo(l,f,e,i,0,d)},10)}})(jwplayer);(function(a){a.utils.arrays=function(){};a.utils.arrays.indexOf=function(c,d){for(var b=0;b<c.length;b++){if(c[b]==d){return b}}return -1};a.utils.arrays.remove=function(c,d){var b=a.utils.arrays.indexOf(c,d);if(b>-1){c.splice(b,1)}}})(jwplayer);(function(a){a.utils.extensionmap={"3gp":{html5:"video/3gpp",flash:"video"},"3gpp":{html5:"video/3gpp"},"3g2":{html5:"video/3gpp2",flash:"video"},"3gpp2":{html5:"video/3gpp2"},flv:{flash:"video"},f4a:{html5:"audio/mp4"},f4b:{html5:"audio/mp4",flash:"video"},f4v:{html5:"video/mp4",flash:"video"},mov:{html5:"video/quicktime",flash:"video"},m4a:{html5:"audio/mp4",flash:"video"},m4b:{html5:"audio/mp4"},m4p:{html5:"audio/mp4"},m4v:{html5:"video/mp4",flash:"video"},mp4:{html5:"video/mp4",flash:"video"},rbs:{flash:"sound"},aac:{html5:"audio/aac",flash:"video"},mp3:{html5:"audio/mp3",flash:"sound"},ogg:{html5:"audio/ogg"},ogv:{html5:"video/ogg"},webm:{html5:"video/webm"},m3u8:{html5:"audio/x-mpegurl"},gif:{flash:"image"},jpeg:{flash:"image"},jpg:{flash:"image"},swf:{flash:"image"},png:{flash:"image"},wav:{html5:"audio/x-wav"}}})(jwplayer);(function(e){e.utils.mediaparser=function(){};var g={element:{width:"width",height:"height",id:"id","class":"className",name:"name"},media:{src:"file",preload:"preload",autoplay:"autostart",loop:"repeat",controls:"controls"},source:{src:"file",type:"type",media:"media","data-jw-width":"width","data-jw-bitrate":"bitrate"},video:{poster:"image"}};var f={};e.utils.mediaparser.parseMedia=function(i){return d(i)};function c(j,i){if(i===undefined){i=g[j]}else{e.utils.extend(i,g[j])}return i}function d(m,i){if(f[m.tagName.toLowerCase()]&&(i===undefined)){return f[m.tagName.toLowerCase()](m)}else{i=c("element",i);var n={};for(var j in i){if(j!="length"){var l=m.getAttribute(j);if(!(l===""||l===undefined||l===null)){n[i[j]]=m.getAttribute(j)}}}var k=m.style["#background-color"];if(k&&!(k=="transparent"||k=="rgba(0, 0, 0, 0)")){n.screencolor=k}return n}}function h(n,k){k=c("media",k);var l=[];var j=e.utils.selectors("source",n);for(var m in j){if(!isNaN(m)){l.push(a(j[m]))}}var o=d(n,k);if(o.file!==undefined){l[0]={file:o.file}}o.levels=l;return o}function a(k,j){j=c("source",j);var i=d(k,j);i.width=i.width?i.width:0;i.bitrate=i.bitrate?i.bitrate:0;return i}function b(k,j){j=c("video",j);var i=h(k,j);return i}f.media=h;f.audio=h;f.source=a;f.video=b})(jwplayer);(function(a){a.utils.loaderstatus={NEW:"NEW",LOADING:"LOADING",ERROR:"ERROR",COMPLETE:"COMPLETE"};a.utils.scriptloader=function(c){var d=a.utils.loaderstatus.NEW;var b=new a.events.eventdispatcher();a.utils.extend(this,b);this.load=function(){if(d==a.utils.loaderstatus.NEW){d=a.utils.loaderstatus.LOADING;var e=document.createElement("script");e.onload=function(f){d=a.utils.loaderstatus.COMPLETE;b.sendEvent(a.events.COMPLETE)};e.onerror=function(f){d=a.utils.loaderstatus.ERROR;b.sendEvent(a.events.ERROR)};e.onreadystatechange=function(){if(e.readyState=="loaded"||e.readyState=="complete"){d=a.utils.loaderstatus.COMPLETE;b.sendEvent(a.events.COMPLETE)}};document.getElementsByTagName("head")[0].appendChild(e);e.src=c}};this.getStatus=function(){return d}}})(jwplayer);(function(a){a.utils.selectors=function(b,d){if(d===undefined){d=document}b=a.utils.strings.trim(b);var c=b.charAt(0);if(c=="#"){return d.getElementById(b.substr(1))}else{if(c=="."){if(d.getElementsByClassName){return d.getElementsByClassName(b.substr(1))}else{return a.utils.selectors.getElementsByTagAndClass("*",b.substr(1))}}else{if(b.indexOf(".")>0){selectors=b.split(".");return a.utils.selectors.getElementsByTagAndClass(selectors[0],selectors[1])}else{return d.getElementsByTagName(b)}}}return null};a.utils.selectors.getElementsByTagAndClass=function(e,h,g){elements=[];if(g===undefined){g=document}var f=g.getElementsByTagName(e);for(var d=0;d<f.length;d++){if(f[d].className!==undefined){var c=f[d].className.split(" ");for(var b=0;b<c.length;b++){if(c[b]==h){elements.push(f[d])}}}}return elements}})(jwplayer);(function(a){a.utils.strings=function(){};a.utils.strings.trim=function(b){return b.replace(/^\s*/,"").replace(/\s*$/,"")};a.utils.strings.pad=function(c,d,b){if(!b){b="0"}while(c.length<d){c=b+c}return c};a.utils.strings.serialize=function(b){if(b==null){return null}else{if(b=="true"){return true}else{if(b=="false"){return false}else{if(isNaN(Number(b))||b.length>5||b.length==0){return b}else{return Number(b)}}}}};a.utils.strings.seconds=function(d){d=d.replace(",",".");var b=d.split(":");var c=0;if(d.substr(-1)=="s"){c=Number(d.substr(0,d.length-1))}else{if(d.substr(-1)=="m"){c=Number(d.substr(0,d.length-1))*60}else{if(d.substr(-1)=="h"){c=Number(d.substr(0,d.length-1))*3600}else{if(b.length>1){c=Number(b[b.length-1]);c+=Number(b[b.length-2])*60;if(b.length==3){c+=Number(b[b.length-3])*3600}}else{c=Number(d)}}}}return c};a.utils.strings.xmlAttribute=function(b,c){for(var d in b.attributes){if(b.attributes[d].name&&b.attributes[d].name.toLowerCase()==c.toLowerCase()){return b.attributes[d].value.toString()}}return""};a.utils.strings.jsonToString=function(f){var h=h||{};if(h&&h.stringify){return h.stringify(f)}var c=typeof(f);if(c!="object"||f===null){if(c=="string"){f='"'+f+'"'}else{return String(f)}}else{var g=[],b=(f&&f.constructor==Array);for(var d in f){var e=f[d];switch(typeof(e)){case"string":e='"'+e+'"';break;case"object":if(e!==null){e=a.utils.strings.jsonToString(e)}break}if(b){if(typeof(e)!="function"){g.push(String(e))}}else{if(typeof(e)!="function"){g.push('"'+d+'":'+String(e))}}}if(b){return"["+String(g)+"]"}else{return"{"+String(g)+"}"}}}})(jwplayer);(function(c){var d=new RegExp(/^(#|0x)[0-9a-fA-F]{3,6}/);c.utils.typechecker=function(g,f){f=f===null?b(g):f;return e(g,f)};function b(f){var g=["true","false","t","f"];if(g.toString().indexOf(f.toLowerCase().replace(" ",""))>=0){return"boolean"}else{if(d.test(f)){return"color"}else{if(!isNaN(parseInt(f,10))&&parseInt(f,10).toString().length==f.length){return"integer"}else{if(!isNaN(parseFloat(f))&&parseFloat(f).toString().length==f.length){return"float"}}}}return"string"}function e(g,f){if(f===null){return g}switch(f){case"color":if(g.length>0){return a(g)}return null;case"integer":return parseInt(g,10);case"float":return parseFloat(g);case"boolean":if(g.toLowerCase()=="true"){return true}else{if(g=="1"){return true}}return false}return g}function a(f){switch(f.toLowerCase()){case"blue":return parseInt("0000FF",16);case"green":return parseInt("00FF00",16);case"red":return parseInt("FF0000",16);case"cyan":return parseInt("00FFFF",16);case"magenta":return parseInt("FF00FF",16);case"yellow":return parseInt("FFFF00",16);case"black":return parseInt("000000",16);case"white":return parseInt("FFFFFF",16);default:f=f.replace(/(#|0x)?([0-9A-F]{3,6})$/gi,"$2");if(f.length==3){f=f.charAt(0)+f.charAt(0)+f.charAt(1)+f.charAt(1)+f.charAt(2)+f.charAt(2)}return parseInt(f,16)}return parseInt("000000",16)}})(jwplayer);(function(a){var c={};var b={};a.plugins=function(){};a.plugins.loadPlugins=function(e,d){b[e]=new a.plugins.pluginloader(new a.plugins.model(c),d);return b[e]};a.plugins.registerPlugin=function(h,f,e){var d=a.utils.getPluginName(h);if(c[d]){c[d].registerPlugin(h,f,e)}else{a.utils.log("A plugin ("+h+") was registered with the player that was not loaded. Please check your configuration.");for(var g in b){b[g].pluginFailed()}}}})(jwplayer);(function(a){a.plugins.model=function(b){this.addPlugin=function(c){var d=a.utils.getPluginName(c);if(!b[d]){b[d]=new a.plugins.plugin(c)}return b[d]}}})(jwplayer);(function(a){a.plugins.pluginmodes={FLASH:"FLASH",JAVASCRIPT:"JAVASCRIPT",HYBRID:"HYBRID"};a.plugins.plugin=function(b){var d="http://plugins.longtailvideo.com";var i=a.utils.loaderstatus.NEW;var j;var h;var k;var c=new a.events.eventdispatcher();a.utils.extend(this,c);function e(){switch(a.utils.getPluginPathType(b)){case a.utils.pluginPathType.ABSOLUTE:return b;case a.utils.pluginPathType.RELATIVE:return a.utils.getAbsolutePath(b,window.location.href);case a.utils.pluginPathType.CDN:var m=a.utils.getPluginName(b);var l=a.utils.getPluginVersion(b);return d+"/"+a.version.split(".")[0]+"/"+m+"/"+m+(l!==""?("-"+l):"")+".js"}}function g(l){k=setTimeout(function(){i=a.utils.loaderstatus.COMPLETE;c.sendEvent(a.events.COMPLETE)},1000)}function f(l){i=a.utils.loaderstatus.ERROR;c.sendEvent(a.events.ERROR)}this.load=function(){if(i==a.utils.loaderstatus.NEW){if(b.lastIndexOf(".swf")>0){j=b;i=a.utils.loaderstatus.COMPLETE;c.sendEvent(a.events.COMPLETE);return}i=a.utils.loaderstatus.LOADING;var l=new a.utils.scriptloader(e());l.addEventListener(a.events.COMPLETE,g);l.addEventListener(a.events.ERROR,f);l.load()}};this.registerPlugin=function(n,m,l){if(k){clearTimeout(k);k=undefined}if(m&&l){j=l;h=m}else{if(typeof m=="string"){j=m}else{if(typeof m=="function"){h=m}else{if(!m&&!l){j=n}}}}i=a.utils.loaderstatus.COMPLETE;c.sendEvent(a.events.COMPLETE)};this.getStatus=function(){return i};this.getPluginName=function(){return a.utils.getPluginName(b)};this.getFlashPath=function(){if(j){switch(a.utils.getPluginPathType(j)){case a.utils.pluginPathType.ABSOLUTE:return j;case a.utils.pluginPathType.RELATIVE:if(b.lastIndexOf(".swf")>0){return a.utils.getAbsolutePath(j,window.location.href)}return a.utils.getAbsolutePath(j,e());case a.utils.pluginPathType.CDN:if(j.indexOf("-")>-1){return j+"h"}return j+"-h"}}return null};this.getJS=function(){return h};this.getPluginmode=function(){if(typeof j!="undefined"&&typeof h!="undefined"){return a.plugins.pluginmodes.HYBRID}else{if(typeof j!="undefined"){return a.plugins.pluginmodes.FLASH}else{if(typeof h!="undefined"){return a.plugins.pluginmodes.JAVASCRIPT}}}};this.getNewInstance=function(m,l,n){return new h(m,l,n)};this.getURL=function(){return b}}})(jwplayer);(function(a){a.plugins.pluginloader=function(h,e){var g={};var j=a.utils.loaderstatus.NEW;var d=false;var b=false;var c=new a.events.eventdispatcher();a.utils.extend(this,c);function f(){if(!b){b=true;j=a.utils.loaderstatus.COMPLETE;c.sendEvent(a.events.COMPLETE)}}function i(){if(!b){var l=0;for(plugin in g){var k=g[plugin].getStatus();if(k==a.utils.loaderstatus.LOADING||k==a.utils.loaderstatus.NEW){l++}}if(l==0){f()}}}this.setupPlugins=function(m,k,r){var l={length:0,plugins:{}};var o={length:0,plugins:{}};for(var n in g){var p=g[n].getPluginName();if(g[n].getFlashPath()){l.plugins[g[n].getFlashPath()]=k.plugins[n];l.plugins[g[n].getFlashPath()].pluginmode=g[n].getPluginmode();l.length++}if(g[n].getJS()){var q=document.createElement("div");q.id=m.id+"_"+p;q.style.position="absolute";q.style.zIndex=o.length+10;o.plugins[p]=g[n].getNewInstance(m,k.plugins[n],q);o.length++;if(typeof o.plugins[p].resize!="undefined"){m.onReady(r(o.plugins[p],q,true));m.onResize(r(o.plugins[p],q))}}}m.plugins=o.plugins;return l};this.load=function(){j=a.utils.loaderstatus.LOADING;d=true;for(var k in e){g[k]=h.addPlugin(k);g[k].addEventListener(a.events.COMPLETE,i);g[k].addEventListener(a.events.ERROR,i)}for(k in e){g[k].load()}d=false;i()};this.pluginFailed=function(){f()};this.getStatus=function(){return j}}})(jwplayer);(function(b){var a=[];b.api=function(d){this.container=d;this.id=d.id;var l={};var p={};var c=[];var h=undefined;var k=false;var i=[];var n=b.utils.getOuterHTML(d);var o={};var j={};this.getBuffer=function(){return this.callInternal("jwGetBuffer")};this.getContainer=function(){return this.container};function e(q){return function(v,r,s,t){var u;if(r){j[v]=r;u="jwplayer('"+q+"').callback('"+v+"')"}else{if(!r&&j[v]){delete j[v]}}h.jwDockSetButton(v,u,s,t)}}this.getPlugin=function(r){var q=this.callInternal;if(r=="dock"){return{setButton:e(this.id),show:function(){return q("jwShowDock")},hide:function(){return q("jwHideDock")}}}else{if(r=="controlbar"){return{show:function(){return q("jwShowControlbar")},hide:function(){return q("jwHideControlbar")}}}else{if(r=="display"){return{show:function(){return q("jwShowDisplay")},hide:function(){return q("jwHideDisplay")}}}}}return this.plugins[r]};this.callback=function(q){if(j[q]){return j[q]()}};this.getDuration=function(){return this.callInternal("jwGetDuration")};this.getFullscreen=function(){return this.callInternal("jwGetFullscreen")};this.getHeight=function(){return this.callInternal("jwGetHeight")};this.getLockState=function(){return this.callInternal("jwGetLockState")};this.getMeta=function(){return this.getItemMeta()};this.getMute=function(){return this.callInternal("jwGetMute")};this.getPlaylist=function(){var r=this.callInternal("jwGetPlaylist");if(this.renderingMode=="flash"){b.utils.deepReplaceKeyName(r,"__dot__",".")}for(var q=0;q<r.length;q++){if(r[q].index===undefined){r[q].index=q}}return r};this.getPlaylistItem=function(q){if(q===undefined){q=this.getCurrentItem()}return this.getPlaylist()[q]};this.getPosition=function(){return this.callInternal("jwGetPosition")};this.getRenderingMode=function(){return this.renderingMode};this.getState=function(){return this.callInternal("jwGetState")};this.getVolume=function(){return this.callInternal("jwGetVolume")};this.getWidth=function(){return this.callInternal("jwGetWidth")};this.setFullscreen=function(q){if(q===undefined){this.callInternal("jwSetFullscreen",!this.callInternal("jwGetFullscreen"))}else{this.callInternal("jwSetFullscreen",q)}return this};this.setMute=function(q){if(q===undefined){this.callInternal("jwSetMute",!this.callInternal("jwGetMute"))}else{this.callInternal("jwSetMute",q)}return this};this.lock=function(){return this};this.unlock=function(){return this};this.load=function(q){this.callInternal("jwLoad",q);return this};this.playlistItem=function(q){this.callInternal("jwPlaylistItem",q);return this};this.playlistPrev=function(){this.callInternal("jwPlaylistPrev");return this};this.playlistNext=function(){this.callInternal("jwPlaylistNext");return this};this.resize=function(r,q){if(this.renderingMode=="html5"){h.jwResize(r,q)}else{this.container.width=r;this.container.height=q}return this};this.play=function(q){if(typeof q=="undefined"){q=this.getState();if(q==b.api.events.state.PLAYING||q==b.api.events.state.BUFFERING){this.callInternal("jwPause")}else{this.callInternal("jwPlay")}}else{this.callInternal("jwPlay",q)}return this};this.pause=function(q){if(typeof q=="undefined"){q=this.getState();if(q==b.api.events.state.PLAYING||q==b.api.events.state.BUFFERING){this.callInternal("jwPause")}else{this.callInternal("jwPlay")}}else{this.callInternal("jwPause",q)}return this};this.stop=function(){this.callInternal("jwStop");return this};this.seek=function(q){this.callInternal("jwSeek",q);return this};this.setVolume=function(q){this.callInternal("jwSetVolume",q);return this};this.onBufferChange=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_BUFFER,q)};this.onBufferFull=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL,q)};this.onError=function(q){return this.eventListener(b.api.events.JWPLAYER_ERROR,q)};this.onFullscreen=function(q){return this.eventListener(b.api.events.JWPLAYER_FULLSCREEN,q)};this.onMeta=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_META,q)};this.onMute=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_MUTE,q)};this.onPlaylist=function(q){return this.eventListener(b.api.events.JWPLAYER_PLAYLIST_LOADED,q)};this.onPlaylistItem=function(q){return this.eventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM,q)};this.onReady=function(q){return this.eventListener(b.api.events.API_READY,q)};this.onResize=function(q){return this.eventListener(b.api.events.JWPLAYER_RESIZE,q)};this.onComplete=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_COMPLETE,q)};this.onSeek=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_SEEK,q)};this.onTime=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_TIME,q)};this.onVolume=function(q){return this.eventListener(b.api.events.JWPLAYER_MEDIA_VOLUME,q)};this.onBuffer=function(q){return this.stateListener(b.api.events.state.BUFFERING,q)};this.onPause=function(q){return this.stateListener(b.api.events.state.PAUSED,q)};this.onPlay=function(q){return this.stateListener(b.api.events.state.PLAYING,q)};this.onIdle=function(q){return this.stateListener(b.api.events.state.IDLE,q)};this.remove=function(){l={};i=[];if(b.utils.getOuterHTML(this.container)!=n){b.api.destroyPlayer(this.id,n)}};this.setup=function(r){if(b.embed){var q=this.id;this.remove();var s=b(q);s.config=r;return new b.embed(s)}return this};this.registerPlugin=function(s,r,q){b.plugins.registerPlugin(s,r,q)};this.setPlayer=function(q,r){h=q;this.renderingMode=r};this.stateListener=function(q,r){if(!p[q]){p[q]=[];this.eventListener(b.api.events.JWPLAYER_PLAYER_STATE,g(q))}p[q].push(r);return this};function g(q){return function(s){var r=s.newstate,u=s.oldstate;if(r==q){var t=p[r];if(t){for(var v=0;v<t.length;v++){if(typeof t[v]=="function"){t[v].call(this,{oldstate:u,newstate:r})}}}}}}this.addInternalListener=function(q,r){q.jwAddEventListener(r,'function(dat) { jwplayer("'+this.id+'").dispatchEvent("'+r+'", dat); }')};this.eventListener=function(q,r){if(!l[q]){l[q]=[];if(h&&k){this.addInternalListener(h,q)}}l[q].push(r);return this};this.dispatchEvent=function(s){if(l[s]){var r=f(s,arguments[1]);for(var q=0;q<l[s].length;q++){if(typeof l[s][q]=="function"){l[s][q].call(this,r)}}}};function f(s,q){var u=b.utils.extend({},q);if(s==b.api.events.JWPLAYER_FULLSCREEN&&!u.fullscreen){u.fullscreen=u.message=="true"?true:false;delete u.message}else{if(typeof u.data=="object"){u=b.utils.extend(u,u.data);delete u.data}}var r=["position","duration","offset"];for(var t in r){if(u[r[t]]){u[r[t]]=Math.round(u[r[t]]*1000)/1000}}return u}this.callInternal=function(r,q){if(k){if(typeof h!="undefined"&&typeof h[r]=="function"){if(q!==undefined){return(h[r])(q)}else{return(h[r])()}}return null}else{i.push({method:r,parameters:q})}};this.playerReady=function(s){k=true;if(!h){this.setPlayer(document.getElementById(s.id))}this.container=document.getElementById(this.id);for(var q in l){this.addInternalListener(h,q)}this.eventListener(b.api.events.JWPLAYER_PLAYLIST_ITEM,function(t){o={}});this.eventListener(b.api.events.JWPLAYER_MEDIA_META,function(t){b.utils.extend(o,t.metadata)});this.dispatchEvent(b.api.events.API_READY);while(i.length>0){var r=i.shift();this.callInternal(r.method,r.parameters)}};this.getItemMeta=function(){return o};this.getCurrentItem=function(){return this.callInternal("jwGetPlaylistIndex")};function m(s,u,t){var q=[];if(!u){u=0}if(!t){t=s.length-1}for(var r=u;r<=t;r++){q.push(s[r])}return q}return this};b.api.selectPlayer=function(d){var c;if(d===undefined){d=0}if(d.nodeType){c=d}else{if(typeof d=="string"){c=document.getElementById(d)}}if(c){var e=b.api.playerById(c.id);if(e){return e}else{return b.api.addPlayer(new b.api(c))}}else{if(typeof d=="number"){return b.getPlayers()[d]}}return null};b.api.events={API_READY:"jwplayerAPIReady",JWPLAYER_READY:"jwplayerReady",JWPLAYER_FULLSCREEN:"jwplayerFullscreen",JWPLAYER_RESIZE:"jwplayerResize",JWPLAYER_ERROR:"jwplayerError",JWPLAYER_MEDIA_BUFFER:"jwplayerMediaBuffer",JWPLAYER_MEDIA_BUFFER_FULL:"jwplayerMediaBufferFull",JWPLAYER_MEDIA_ERROR:"jwplayerMediaError",JWPLAYER_MEDIA_LOADED:"jwplayerMediaLoaded",JWPLAYER_MEDIA_COMPLETE:"jwplayerMediaComplete",JWPLAYER_MEDIA_SEEK:"jwplayerMediaSeek",JWPLAYER_MEDIA_TIME:"jwplayerMediaTime",JWPLAYER_MEDIA_VOLUME:"jwplayerMediaVolume",JWPLAYER_MEDIA_META:"jwplayerMediaMeta",JWPLAYER_MEDIA_MUTE:"jwplayerMediaMute",JWPLAYER_PLAYER_STATE:"jwplayerPlayerState",JWPLAYER_PLAYLIST_LOADED:"jwplayerPlaylistLoaded",JWPLAYER_PLAYLIST_ITEM:"jwplayerPlaylistItem"};b.api.events.state={BUFFERING:"BUFFERING",IDLE:"IDLE",PAUSED:"PAUSED",PLAYING:"PLAYING"};b.api.playerById=function(d){for(var c=0;c<a.length;c++){if(a[c].id==d){return a[c]}}return null};b.api.addPlayer=function(c){for(var d=0;d<a.length;d++){if(a[d]==c){return c}}a.push(c);return c};b.api.destroyPlayer=function(g,d){var f=-1;for(var i=0;i<a.length;i++){if(a[i].id==g){f=i;continue}}if(f>=0){var c=document.getElementById(a[f].id);if(document.getElementById(a[f].id+"_wrapper")){c=document.getElementById(a[f].id+"_wrapper")}if(c){if(d){b.utils.setOuterHTML(c,d)}else{var h=document.createElement("div");var e=c.id;if(c.id.indexOf("_wrapper")==c.id.length-8){newID=c.id.substring(0,c.id.length-8)}h.setAttribute("id",e);c.parentNode.replaceChild(h,c)}}a.splice(f,1)}return null};b.getPlayers=function(){return a.slice(0)}})(jwplayer);var _userPlayerReady=(typeof playerReady=="function")?playerReady:undefined;playerReady=function(b){var a=jwplayer.api.playerById(b.id);if(a){a.playerReady(b)}if(_userPlayerReady){_userPlayerReady.call(this,b)}};(function(a){a.embed=function(g){var i={width:400,height:300,components:{controlbar:{position:"over"}}};var f=a.utils.mediaparser.parseMedia(g.container);var e=new a.embed.config(a.utils.extend(i,f,g.config),this);var h=a.plugins.loadPlugins(g.id,e.plugins);function c(l,k){for(var j in k){if(typeof l[j]=="function"){(l[j]).call(l,k[j])}}}function d(){if(h.getStatus()==a.utils.loaderstatus.COMPLETE){for(var l=0;l<e.modes.length;l++){if(e.modes[l].type&&a.embed[e.modes[l].type]){var j=e;if(e.modes[l].config){j=a.utils.extend(a.utils.clone(e),e.modes[l].config)}var k=new a.embed[e.modes[l].type](document.getElementById(g.id),e.modes[l],j,h,g);if(k.supportsConfig()){k.embed();c(g,e.events);return g}}}a.utils.log("No suitable players found");new a.embed.logo(a.utils.extend({hide:true},e.components.logo),"none",g.id)}}h.addEventListener(a.events.COMPLETE,d);h.addEventListener(a.events.ERROR,d);h.load();return g};function b(){if(!document.body){return setTimeout(b,15)}var c=a.utils.selectors.getElementsByTagAndClass("video","jwplayer");for(var d=0;d<c.length;d++){var e=c[d];a(e.id).setup({})}}b()})(jwplayer);(function(a){function c(){return[{type:"flash",src:"/jwplayer/player.swf"},{type:"html5"},{type:"download"}]}function e(l){var k=l.toLowerCase();var j=["left","right","top","bottom"];for(var i=0;i<j.length;i++){if(k==j[i]){return true}}return false}function d(j){var i=false;i=(j instanceof Array)||(typeof j=="object"&&!j.position&&!j.size);return i}function h(i){if(typeof i=="string"){if(parseInt(i).toString()==i||i.toLowerCase().indexOf("px")>-1){return parseInt(i)}}return i}var f=["playlist","dock","controlbar","logo"];function g(j){var m={};switch(a.utils.typeOf(j.plugins)){case"object":for(var l in j.plugins){m[a.utils.getPluginName(l)]=l}break;case"string":var n=j.plugins.split(",");for(var k=0;k<n.length;k++){m[a.utils.getPluginName(n[k])]=n[k]}break}return m}function b(m,l,k,i){if(a.utils.typeOf(m[l])!="object"){m[l]={}}var j=m[l][k];if(a.utils.typeOf(j)!="object"){m[l][k]=j={}}if(l=="plugins"){var n=a.utils.getPluginName(k);j[i]=m[n+"."+i];delete m[n+"."+i]}else{j[i]=m[k+"."+i];delete m[k+"."+i]}}a.embed.deserialize=function(i){var j=g(i);for(var m in i){if(m.indexOf(".")>-1){var l=m.split(".");var k=l[0];var m=l[1];if(a.utils.isInArray(f,k)){b(i,"components",k,m)}else{if(j[k]){b(i,"plugins",j[k],m)}}}}return i};a.embed.config=function(i,q){var p=a.utils.extend({},i);var n;if(d(p.playlist)){n=p.playlist;delete p.playlist}p=a.embed.deserialize(p);p.height=h(p.height);p.width=h(p.width);if(typeof p.plugins=="string"){var j=p.plugins.split(",");if(typeof p.plugins!="object"){p.plugins={}}for(var l=0;l<j.length;l++){var m=a.utils.getPluginName(j[l]);if(typeof p[m]=="object"){p.plugins[j[l]]=p[m];delete p[m]}else{p.plugins[j[l]]={}}}}for(var o=0;o<f.length;o++){if(typeof p[f[o]]=="string"){if(!p.components[f[o]]){p.components[f[o]]={}}if(f[o]=="logo"){p.components[f[o]].file=p[f[o]]}else{p.components[f[o]].position=p[f[o]]}delete p[f[o]]}else{if(typeof p[f[o]]!="undefined"){if(!p.components[f[o]]){p.components[f[o]]={}}a.utils.extend(p.components[f[o]],p[f[o]]);delete p[f[o]]}}if(typeof p[f[o]+"size"]!="undefined"){if(!p.components[f[o]]){p.components[f[o]]={}}p.components[f[o]].size=p[f[o]+"size"];delete p[f[o]+"size"]}}if(typeof p.icons!="undefined"){if(!p.components.display){p.components.display={}}p.components.display.icons=p.icons;delete p.icons}if(p.players){p.modes=p.players;delete p.players}var k;if(p.flashplayer&&!p.modes){k=c();k[0].src=p.flashplayer;delete p.flashplayer}else{if(p.modes){if(typeof p.modes=="string"){k=c();k[0].src=p.modes}else{if(p.modes instanceof Array){k=p.modes}else{if(typeof p.modes=="object"&&p.modes.type){k=[p.modes]}}}delete p.modes}else{k=c()}}p.modes=k;if(n){p.playlist=n}return p}})(jwplayer);(function(a){a.embed.download=function(c,g,b,d,f){this.embed=function(){var j=a.utils.extend({},b);var p={};var i=b.width?b.width:480;if(typeof i!="number"){i=parseInt(i,10)}var l=b.height?b.height:320;if(typeof l!="number"){l=parseInt(l,10)}var t,n,m;var r={};if(b.playlist&&b.playlist.length){r.file=b.playlist[0].file;n=b.playlist[0].image;r.levels=b.playlist[0].levels}else{r.file=b.file;n=b.image;r.levels=b.levels}if(r.file){t=r.file}else{if(r.levels&&r.levels.length){t=r.levels[0].file}}m=t?"pointer":"auto";var k={display:{style:{cursor:m,width:i,height:l,backgroundColor:"#000",position:"relative",textDecoration:"none",border:"none",display:"block"}},display_icon:{style:{cursor:m,position:"absolute",display:t?"block":"none",top:0,left:0,border:0,margin:0,padding:0,zIndex:3,width:50,height:50,backgroundImage:"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg==)"}},display_iconBackground:{style:{cursor:m,position:"absolute",display:t?"block":"none",top:((l-50)/2),left:((i-50)/2),border:0,width:50,height:50,margin:0,padding:0,zIndex:2,backgroundImage:"url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC)"}},display_image:{style:{width:i,height:l,display:n?"block":"none",position:"absolute",cursor:m,left:0,top:0,margin:0,padding:0,textDecoration:"none",zIndex:1,border:"none"}}};var h=function(u,w,x){var v=document.createElement(u);if(x){v.id=x}else{v.id=c.id+"_jwplayer_"+w}a.utils.css(v,k[w].style);return v};p.display=h("a","display",c.id);if(t){p.display.setAttribute("href",a.utils.getAbsolutePath(t))}p.display_image=h("img","display_image");p.display_image.setAttribute("alt","Click to download...");if(n){p.display_image.setAttribute("src",a.utils.getAbsolutePath(n))}if(true){p.display_icon=h("div","display_icon");p.display_iconBackground=h("div","display_iconBackground");p.display.appendChild(p.display_image);p.display_iconBackground.appendChild(p.display_icon);p.display.appendChild(p.display_iconBackground)}_css=a.utils.css;_hide=function(u){_css(u,{display:"none"})};function q(u){_imageWidth=p.display_image.naturalWidth;_imageHeight=p.display_image.naturalHeight;s()}function s(){a.utils.stretch(a.utils.stretching.UNIFORM,p.display_image,i,l,_imageWidth,_imageHeight)}p.display_image.onerror=function(u){_hide(p.display_image)};p.display_image.onload=q;c.parentNode.replaceChild(p.display,c);var o=(b.plugins&&b.plugins.logo)?b.plugins.logo:{};p.display.appendChild(new a.embed.logo(b.components.logo,"download",c.id));f.container=document.getElementById(f.id);f.setPlayer(p.display,"download")};this.supportsConfig=function(){if(b){var j=a.utils.getFirstPlaylistItemFromConfig(b);if(typeof j.file=="undefined"&&typeof j.levels=="undefined"){return true}else{if(j.file){return e(j.file,j.provider,j.playlistfile)}else{if(j.levels&&j.levels.length){for(var h=0;h<j.levels.length;h++){if(j.levels[h].file&&e(j.levels[h].file,j.provider,j.playlistfile)){return true}}}}}}else{return true}};function e(i,k,h){if(h){return false}var j=["image","sound","youtube","http"];if(k&&(j.toString().indexOf(k)>-1)){return true}if(!k||(k&&k=="video")){var l=a.utils.extension(i);if(l&&a.utils.extensionmap[l]){return true}}return false}}})(jwplayer);(function(a){a.embed.flash=function(f,g,k,e,i){function l(n,m,o){var p=document.createElement("param");p.setAttribute("name",m);p.setAttribute("value",o);n.appendChild(p)}function j(n,o,m){return function(p){if(m){document.getElementById(i.id+"_wrapper").appendChild(o)}var r=document.getElementById(i.id).getPluginConfig("display");n.resize(r.width,r.height);var q={left:r.x,top:r.y};a.utils.css(o,q)}}function d(o){if(!o){return{}}var q={};for(var n in o){var m=o[n];for(var p in m){q[n+"."+p]=m[p]}}return q}function h(p,o){if(p[o]){var r=p[o];for(var n in r){var m=r[n];if(typeof m=="string"){if(!p[n]){p[n]=m}}else{for(var q in m){if(!p[n+"."+q]){p[n+"."+q]=m[q]}}}}delete p[o]}}function b(p){if(!p){return{}}var s={},r=[];for(var m in p){var o=a.utils.getPluginName(m);var n=p[m];r.push(m);for(var q in n){s[o+"."+q]=n[q]}}s.plugins=r.join(",");return s}function c(o){var m=o.netstreambasepath?"":"netstreambasepath="+encodeURIComponent(window.location.href)+"&";for(var n in o){if(typeof(o[n])=="object"){m+=n+"="+encodeURIComponent("[[JSON]]"+a.utils.strings.jsonToString(o[n]))+"&"}else{m+=n+"="+encodeURIComponent(o[n])+"&"}}return m.substring(0,m.length-1)}this.embed=function(){k.id=i.id;var x;var p=a.utils.extend({},k);var m=p.width;var v=p.height;if(f.id+"_wrapper"==f.parentNode.id){x=document.getElementById(f.id+"_wrapper")}else{x=document.createElement("div");x.id=f.id+"_wrapper";a.utils.wrap(f,x);a.utils.css(x,{position:"relative",width:m,height:v})}var n=e.setupPlugins(i,p,j);if(n.length>0){a.utils.extend(p,b(n.plugins))}else{delete p.plugins}var q=["height","width","modes","events"];for(var t=0;t<q.length;t++){delete p[q[t]]}var o="opaque";if(p.wmode){o=p.wmode}h(p,"components");h(p,"providers");if(typeof p["dock.position"]!="undefined"){if(p["dock.position"].toString().toLowerCase()=="false"){p.dock=p["dock.position"];delete p["dock.position"]}}var w="#000000";var s;if(a.utils.isIE()){var u='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" bgcolor="'+w+'" width="100%" height="100%" id="'+f.id+'" name="'+f.id+'" tabindex=0"">';u+='<param name="movie" value="'+g.src+'">';u+='<param name="allowfullscreen" value="true">';u+='<param name="allowscriptaccess" value="always">';u+='<param name="seamlesstabbing" value="true">';u+='<param name="wmode" value="'+o+'">';u+='<param name="flashvars" value="'+c(p)+'">';u+="</object>";a.utils.setOuterHTML(f,u);s=document.getElementById(f.id)}else{var r=document.createElement("object");r.setAttribute("type","application/x-shockwave-flash");r.setAttribute("data",g.src);r.setAttribute("width","100%");r.setAttribute("height","100%");r.setAttribute("bgcolor","#000000");r.setAttribute("id",f.id);r.setAttribute("name",f.id);r.setAttribute("tabindex",0);l(r,"allowfullscreen","true");l(r,"allowscriptaccess","always");l(r,"seamlesstabbing","true");l(r,"wmode",o);l(r,"flashvars",c(p));f.parentNode.replaceChild(r,f);s=r}i.container=s;i.setPlayer(s,"flash")};this.supportsConfig=function(){if(a.utils.hasFlash()){if(k){var n=a.utils.getFirstPlaylistItemFromConfig(k);if(typeof n.file=="undefined"&&typeof n.levels=="undefined"){return true}else{if(n.file){return flashCanPlay(n.file,n.provider)}else{if(n.levels&&n.levels.length){for(var m=0;m<n.levels.length;m++){if(n.levels[m].file&&flashCanPlay(n.levels[m].file,n.provider)){return true}}}}}}else{return true}}return false};flashCanPlay=function(m,o){var n=["video","http","sound","image"];if(o&&(n.toString().indexOf(o<0))){return true}var p=a.utils.extension(m);if(!p){return true}if(a.utils.extensionmap[p]!==undefined&&a.utils.extensionmap[p].flash===undefined){return false}return true}}})(jwplayer);(function(a){a.embed.html5=function(c,g,b,d,f){function e(i,j,h){return function(k){var l=document.getElementById(c.id+"_displayarea");if(h){l.appendChild(j)}var m=l.style;i.resize(parseInt(m.width.replace("px","")),parseInt(m.height.replace("px","")));j.left=m.left;j.top=m.top}}this.embed=function(){if(a.html5){d.setupPlugins(f,b,e);c.innerHTML="";var j=a.utils.extend({screencolor:"0x000000"},b);var h=["plugins","modes","events"];for(var k=0;k<h.length;k++){delete j[h[k]]}if(j.levels&&!j.sources){j.sources=b.levels}if(j.skin&&j.skin.toLowerCase().indexOf(".zip")>0){j.skin=j.skin.replace(/\.zip/i,".xml")}var l=new (a.html5(c)).setup(j);f.container=document.getElementById(f.id);f.setPlayer(l,"html5")}else{return null}};this.supportsConfig=function(){var h=document.createElement("video");if(!!h.canPlayType){if(b){var k=a.utils.getFirstPlaylistItemFromConfig(b);if(typeof k.file=="undefined"&&typeof k.levels=="undefined"){return true}else{if(k.file){return html5CanPlay(h,k.file,k.provider,k.playlistfile)}else{if(k.levels&&k.levels.length){for(var j=0;j<k.levels.length;j++){if(k.levels[j].file&&html5CanPlay(h,k.levels[j].file,k.provider,k.playlistfile)){return true}}}}}}else{return true}}return false};html5CanPlay=function(j,i,k,h){if(h){return false}if(k&&k=="youtube"){return true}if(k&&k!="video"&&k!="http"&&k!="sound"){return false}var l=a.utils.extension(i);if(!l||a.utils.extensionmap[l]===undefined){return true}if(a.utils.extensionmap[l].html5===undefined){return false}if(a.utils.isLegacyAndroid()&&l.match(/m4v|mp4/)){return true}return browserCanPlay(j,a.utils.extensionmap[l].html5)};browserCanPlay=function(i,h){if(!h){return true}return i.canPlayType(h)}}})(jwplayer);(function(a){a.embed.logo=function(l,k,d){var i={prefix:"http://l.longtailvideo.com/"+k+"/",file:"logo.png",link:"http://www.longtailvideo.com/players/jw-flv-player/",margin:8,out:0.5,over:1,timeout:3,hide:false,position:"bottom-left"};_css=a.utils.css;var b;var h;j();function j(){n();c();f()}function n(){if(i.prefix){var p=a.version.split(/\W/).splice(0,2).join("/");if(i.prefix.indexOf(p)<0){i.prefix+=p+"/"}}h=a.utils.extend({},i)}function o(){var r={border:"none",textDecoration:"none",position:"absolute",cursor:"pointer",zIndex:10};r.display=h.hide?"none":"block";var q=h.position.toLowerCase().split("-");for(var p in q){r[q[p]]=h.margin}return r}function c(){b=document.createElement("img");b.id=d+"_jwplayer_logo";b.style.display="none";b.onload=function(p){_css(b,o());e()};if(!h.file){return}if(h.file.indexOf("http://")===0){b.src=h.file}else{b.src=h.prefix+h.file}}if(!h.file){return}function f(){if(h.link){b.onmouseover=g;b.onmouseout=e;b.onclick=m}else{this.mouseEnabled=false}}function m(p){if(typeof p!="undefined"){p.preventDefault();p.stopPropagation()}if(h.link){window.open(h.link,"_blank")}return}function e(p){if(h.link){b.style.opacity=h.out}return}function g(p){if(h.hide){b.style.opacity=h.over}return}return b}})(jwplayer);(function(a){a.html5=function(b){var c=b;this.setup=function(d){a.utils.extend(this,new a.html5.api(c,d));return this};return this}})(jwplayer);(function(b){var c=b.utils.css;b.html5.view=function(p,o,e){var s=p;var l=o;var v=e;var u;var f;var z;var q;var A;var n;function x(){u=document.createElement("div");u.id=l.id;u.className=l.className;_videowrapper=document.createElement("div");_videowrapper.id=u.id+"_video_wrapper";l.id=u.id+"_video";c(u,{position:"relative",height:v.height,width:v.width,padding:0,backgroundColor:B(),zIndex:0});function B(){if(s.skin.getComponentSettings("display")&&s.skin.getComponentSettings("display").backgroundcolor){return s.skin.getComponentSettings("display").backgroundcolor}return parseInt("000000",16)}c(l,{width:v.width,height:v.height,top:0,left:0,zIndex:1,margin:"auto",display:"block"});c(_videowrapper,{overflow:"hidden",position:"absolute",top:0,left:0,bottom:0,right:0});b.utils.wrap(l,u);b.utils.wrap(l,_videowrapper);q=document.createElement("div");q.id=u.id+"_displayarea";u.appendChild(q)}function j(){for(var B=0;B<v.plugins.order.length;B++){var C=v.plugins.order[B];if(v.plugins.object[C].getDisplayElement!==undefined){v.plugins.object[C].height=h(v.plugins.object[C].getDisplayElement().style.height);v.plugins.object[C].width=h(v.plugins.object[C].getDisplayElement().style.width);v.plugins.config[C].currentPosition=v.plugins.config[C].position}}t()}function t(C){if(v.getMedia()!==undefined){for(var B=0;B<v.plugins.order.length;B++){var D=v.plugins.order[B];if(v.plugins.object[D].getDisplayElement!==undefined){if(v.getMedia().hasChrome()){v.plugins.config[D].currentPosition=b.html5.view.positions.NONE}else{v.plugins.config[D].currentPosition=v.plugins.config[D].position}}}}i(v.width,v.height)}function h(B){if(typeof B=="string"){if(B===""){return 0}else{if(B.lastIndexOf("%")>-1){return B}else{return parseInt(B.replace("px",""),10)}}}return B}this.setup=function(B){l=B;x();j();s.jwAddEventListener(b.api.events.JWPLAYER_MEDIA_LOADED,t);s.jwAddEventListener(b.api.events.JWPLAYER_MEDIA_META,function(){w()});var C;if(window.onresize!==null){C=window.onresize}window.onresize=function(D){if(C!==undefined){try{C(D)}catch(F){}}if(s.jwGetFullscreen()){var E=document.body.getBoundingClientRect();v.width=Math.abs(E.left)+Math.abs(E.right);v.height=window.innerHeight}i(v.width,v.height)}};function g(B){switch(B.keyCode){case 27:if(s.jwGetFullscreen()){s.jwSetFullscreen(false)}break;case 32:if(s.jwGetState()!=b.api.events.state.IDLE&&s.jwGetState()!=b.api.events.state.PAUSED){s.jwPause()}else{s.jwPlay()}break}}function i(E,B){if(u.style.display=="none"){return}var D=[].concat(v.plugins.order);D.reverse();A=D.length+2;if(!v.fullscreen){v.width=E;v.height=B;f=E;z=B;c(q,{top:0,bottom:0,left:0,right:0,width:E,height:B});c(u,{height:z,width:f});var C=m(r,D);if(C.length>0){A+=C.length;m(k,C,true)}}else{if(navigator.vendor.indexOf("Apple")!==0){m(y,D,true)}}w()}function m(G,D,E){var C=[];for(var B=0;B<D.length;B++){var H=D[B];if(v.plugins.object[H].getDisplayElement!==undefined){if(v.plugins.config[H].currentPosition!=b.html5.view.positions.NONE){var F=G(H,A--);if(!F){C.push(H)}else{v.plugins.object[H].resize(F.width,F.height);if(E){delete F.width;delete F.height}c(v.plugins.object[H].getDisplayElement(),F)}}else{c(v.plugins.object[H].getDisplayElement(),{display:"none"})}}}return C}function r(C,D){if(v.plugins.object[C].getDisplayElement!==undefined){if(v.plugins.config[C].position&&a(v.plugins.config[C].position)){if(v.plugins.object[C].getDisplayElement().parentNode===null){u.appendChild(v.plugins.object[C].getDisplayElement())}var B=d(C);B.zIndex=D;return B}}return false}function k(D,E){if(v.plugins.object[D].getDisplayElement().parentNode===null){q.appendChild(v.plugins.object[D].getDisplayElement())}var B=v.width,C=v.height;if(typeof v.width=="string"&&v.width.lastIndexOf("%")>-1){percentage=parseFloat(v.width.substring(0,v.width.lastIndexOf("%")))/100;B=Math.round(window.innerWidth*percentage)}if(typeof v.height=="string"&&v.height.lastIndexOf("%")>-1){percentage=parseFloat(v.height.substring(0,v.height.lastIndexOf("%")))/100;C=Math.round(window.innerHeight*percentage)}return{position:"absolute",width:(B-h(q.style.left)-h(q.style.right)),height:(C-h(q.style.top)-h(q.style.bottom)),zIndex:E}}function y(B,C){return{position:"fixed",width:v.width,height:v.height,zIndex:C}}function w(){q.style.position="absolute";v.getMedia().getDisplayElement().style.position="absolute";if(v.getMedia().getDisplayElement().videoWidth==0||v.getMedia().getDisplayElement().videoHeight==0){return}var B,D;if(q.style.width.toString().lastIndexOf("%")>-1||q.style.width.toString().lastIndexOf("%")>-1){var C=q.getBoundingClientRect();B=Math.abs(C.left)+Math.abs(C.right);D=Math.abs(C.top)+Math.abs(C.bottom)}else{B=h(q.style.width);D=h(q.style.height)}b.utils.stretch(s.jwGetStretching(),v.getMedia().getDisplayElement(),B,D,v.getMedia().getDisplayElement().videoWidth,v.getMedia().getDisplayElement().videoHeight)}function d(C){var D={position:"absolute",margin:0,padding:0,top:null};var B=v.plugins.config[C].currentPosition.toLowerCase();switch(B.toUpperCase()){case b.html5.view.positions.TOP:D.top=h(q.style.top);D.left=h(q.style.left);D.width=f-h(q.style.left)-h(q.style.right);D.height=v.plugins.object[C].height;q.style[B]=h(q.style[B])+v.plugins.object[C].height+"px";q.style.height=h(q.style.height)-D.height+"px";break;case b.html5.view.positions.RIGHT:D.top=h(q.style.top);D.right=h(q.style.right);D.width=D.width=v.plugins.object[C].width;D.height=z-h(q.style.top)-h(q.style.bottom);q.style[B]=h(q.style[B])+v.plugins.object[C].width+"px";q.style.width=h(q.style.width)-D.width+"px";break;case b.html5.view.positions.BOTTOM:D.bottom=h(q.style.bottom);D.left=h(q.style.left);D.width=f-h(q.style.left)-h(q.style.right);D.height=v.plugins.object[C].height;q.style[B]=h(q.style[B])+v.plugins.object[C].height+"px";q.style.height=h(q.style.height)-D.height+"px";break;case b.html5.view.positions.LEFT:D.top=h(q.style.top);D.left=h(q.style.left);D.width=v.plugins.object[C].width;D.height=z-h(q.style.top)-h(q.style.bottom);q.style[B]=h(q.style[B])+v.plugins.object[C].width+"px";q.style.width=h(q.style.width)-D.width+"px";break;default:break}return D}this.resize=i;this.fullscreen=function(E){if(navigator.vendor.indexOf("Apple")===0){if(v.getMedia().getDisplayElement().webkitSupportsFullscreen){if(E){try{v.getMedia().getDisplayElement().webkitEnterFullscreen()}catch(D){}}else{try{v.getMedia().getDisplayElement().webkitExitFullscreen()}catch(D){}}}}else{if(E){document.onkeydown=g;clearInterval(n);var C=document.body.getBoundingClientRect();v.width=Math.abs(C.left)+Math.abs(C.right);v.height=window.innerHeight;var B={position:"fixed",width:"100%",height:"100%",top:0,left:0,zIndex:2147483000};c(u,B);B.zIndex=1;c(v.getMedia().getDisplayElement(),B);B.zIndex=2;c(q,B)}else{document.onkeydown="";v.width=f;v.height=z;c(u,{position:"relative",height:v.height,width:v.width,zIndex:0})}i(v.width,v.height)}}};function a(d){return([b.html5.view.positions.TOP,b.html5.view.positions.RIGHT,b.html5.view.positions.BOTTOM,b.html5.view.positions.LEFT].toString().indexOf(d.toUpperCase())>-1)}b.html5.view.positions={TOP:"TOP",RIGHT:"RIGHT",BOTTOM:"BOTTOM",LEFT:"LEFT",OVER:"OVER",NONE:"NONE"}})(jwplayer);(function(a){var b={backgroundcolor:"",margin:10,font:"Arial,sans-serif",fontsize:10,fontcolor:parseInt("000000",16),fontstyle:"normal",fontweight:"bold",buttoncolor:parseInt("ffffff",16),position:a.html5.view.positions.BOTTOM,idlehide:false,layout:{left:{position:"left",elements:[{name:"play",type:"button"},{name:"divider",type:"divider"},{name:"prev",type:"button"},{name:"divider",type:"divider"},{name:"next",type:"button"},{name:"divider",type:"divider"},{name:"elapsed",type:"text"}]},center:{position:"center",elements:[{name:"time",type:"slider"}]},right:{position:"right",elements:[{name:"duration",type:"text"},{name:"blank",type:"button"},{name:"divider",type:"divider"},{name:"mute",type:"button"},{name:"volume",type:"slider"},{name:"divider",type:"divider"},{name:"fullscreen",type:"button"}]}}};_css=a.utils.css;_hide=function(c){_css(c,{display:"none"})};_show=function(c){_css(c,{display:"block"})};a.html5.controlbar=function(k,M){var j=k;var A=a.utils.extend({},b,j.skin.getComponentSettings("controlbar"),M);if(A.position==a.html5.view.positions.NONE||typeof a.html5.view.positions[A.position]=="undefined"){return}if(a.utils.mapLength(j.skin.getComponentLayout("controlbar"))>0){A.layout=j.skin.getComponentLayout("controlbar")}var R;var J;var Q;var B;var t="none";var f;var i;var S;var e;var d;var w;var K={};var o=false;var c={};var O;var h=false;function E(){if(!O){O=j.skin.getSkinElement("controlbar","background");if(!O){O={width:0,height:0,src:null}}}return O}function I(){Q=0;B=0;J=0;if(!o){var Z={height:E().height,backgroundColor:A.backgroundcolor};R=document.createElement("div");R.id=j.id+"_jwplayer_controlbar";_css(R,Z)}var Y=(j.skin.getSkinElement("controlbar","capLeft"));var X=(j.skin.getSkinElement("controlbar","capRight"));if(Y){v("capLeft","left",false,R)}var aa={position:"absolute",height:E().height,left:(Y?Y.width:0),zIndex:0};P("background",R,aa,"img");if(E().src){K.background.src=E().src}aa.zIndex=1;P("elements",R,aa);if(X){v("capRight","right",false,R)}}this.getDisplayElement=function(){return R};this.resize=function(Z,X){a.utils.cancelAnimation(R);document.getElementById(j.id).onmousemove=x;d=Z;w=X;x();var Y=u();D({id:j.id,duration:S,position:i});s({id:j.id,bufferPercent:e});return Y};this.show=function(){h=false;_show(R)};this.hide=function(){h=true;_hide(R)};function p(){var Y=["timeSlider","volumeSlider","timeSliderRail","volumeSliderRail"];for(var Z in Y){var X=Y[Z];if(typeof K[X]!="undefined"){c[X]=K[X].getBoundingClientRect()}}}function x(){if(h){return}a.utils.cancelAnimation(R);if(g()){a.utils.fadeTo(R,1,0,1,0)}else{a.utils.fadeTo(R,0,0.1,1,2)}}function g(){if(h){return false}if(j.jwGetState()==a.api.events.state.IDLE||j.jwGetState()==a.api.events.state.PAUSED){if(A.idlehide){return false}return true}if(j.jwGetFullscreen()){return false}if(A.position==a.html5.view.positions.OVER){return false}return true}function P(ab,aa,Z,X){var Y;if(!o){if(!X){X="div"}Y=document.createElement(X);K[ab]=Y;Y.id=R.id+"_"+ab;aa.appendChild(Y)}else{Y=document.getElementById(R.id+"_"+ab)}if(Z!==undefined){_css(Y,Z)}return Y}function H(){W(A.layout.left);W(A.layout.right,-1);W(A.layout.center)}function W(aa,X){var ab=aa.position=="right"?"right":"left";var Z=a.utils.extend([],aa.elements);if(X!==undefined){Z.reverse()}for(var Y=0;Y<Z.length;Y++){z(Z[Y],ab)}}function F(){return J++}function z(ab,ad){var aa,Y,Z,X,af;if(ab.type=="divider"){v("divider"+F(),ad,true,undefined,undefined,ab.width,ab.element);return}switch(ab.name){case"play":v("playButton",ad,false);v("pauseButton",ad,true);L("playButton","jwPlay");L("pauseButton","jwPause");break;case"prev":v("prevButton",ad,true);L("prevButton","jwPlaylistPrev");break;case"next":v("nextButton",ad,true);L("nextButton","jwPlaylistNext");break;case"elapsed":v("elapsedText",ad,true);break;case"time":Y=j.skin.getSkinElement("controlbar","timeSliderCapLeft")===undefined?0:j.skin.getSkinElement("controlbar","timeSliderCapLeft").width;Z=j.skin.getSkinElement("controlbar","timeSliderCapRight")===undefined?0:j.skin.getSkinElement("controlbar","timeSliderCapRight").width;aa=ad=="left"?Y:Z;X=j.skin.getSkinElement("controlbar","timeSliderRail").width+Y+Z;af={height:E().height,position:"absolute",top:0,width:X};af[ad]=ad=="left"?Q:B;var ac=P("timeSlider",K.elements,af);v("timeSliderCapLeft",ad,true,ac,ad=="left"?0:aa);v("timeSliderRail",ad,false,ac,aa);v("timeSliderBuffer",ad,false,ac,aa);v("timeSliderProgress",ad,false,ac,aa);v("timeSliderThumb",ad,false,ac,aa);v("timeSliderCapRight",ad,true,ac,ad=="right"?0:aa);N("time");break;case"fullscreen":v("fullscreenButton",ad,false);v("normalscreenButton",ad,true);L("fullscreenButton","jwSetFullscreen",true);L("normalscreenButton","jwSetFullscreen",false);break;case"volume":Y=j.skin.getSkinElement("controlbar","volumeSliderCapLeft")===undefined?0:j.skin.getSkinElement("controlbar","volumeSliderCapLeft").width;Z=j.skin.getSkinElement("controlbar","volumeSliderCapRight")===undefined?0:j.skin.getSkinElement("controlbar","volumeSliderCapRight").width;aa=ad=="left"?Y:Z;X=j.skin.getSkinElement("controlbar","volumeSliderRail").width+Y+Z;af={height:E().height,position:"absolute",top:0,width:X};af[ad]=ad=="left"?Q:B;var ae=P("volumeSlider",K.elements,af);v("volumeSliderCapLeft",ad,true,ae,ad=="left"?0:aa);v("volumeSliderRail",ad,true,ae,aa);v("volumeSliderProgress",ad,false,ae,aa);v("volumeSliderCapRight",ad,true,ae,ad=="right"?0:aa);N("volume");break;case"mute":v("muteButton",ad,false);v("unmuteButton",ad,true);L("muteButton","jwSetMute",true);L("unmuteButton","jwSetMute",false);break;case"duration":v("durationText",ad,true);break}}function v(aa,ad,Y,ag,ab,X,Z){if(j.skin.getSkinElement("controlbar",aa)!==undefined||aa.indexOf("Text")>0||aa.indexOf("divider")===0){var ac={height:E().height,position:"absolute",display:"block",top:0};if((aa.indexOf("next")===0||aa.indexOf("prev")===0)&&j.jwGetPlaylist().length<2){Y=false;ac.display="none"}var ah;if(aa.indexOf("Text")>0){aa.innerhtml="00:00";ac.font=A.fontsize+"px/"+(E().height+1)+"px "+A.font;ac.color=A.fontcolor;ac.textAlign="center";ac.fontWeight=A.fontweight;ac.fontStyle=A.fontstyle;ac.cursor="default";ah=14+3*A.fontsize}else{if(aa.indexOf("divider")===0){if(X){if(!isNaN(parseInt(X))){ah=parseInt(X)}}else{if(Z){var ae=j.skin.getSkinElement("controlbar",Z);if(ae){ac.background="url("+ae.src+") repeat-x center left";ah=ae.width}}else{ac.background="url("+j.skin.getSkinElement("controlbar","divider").src+") repeat-x center left";ah=j.skin.getSkinElement("controlbar","divider").width}}}else{ac.background="url("+j.skin.getSkinElement("controlbar",aa).src+") repeat-x center left";ah=j.skin.getSkinElement("controlbar",aa).width}}if(ad=="left"){ac.left=isNaN(ab)?Q:ab;if(Y){Q+=ah}}else{if(ad=="right"){ac.right=isNaN(ab)?B:ab;if(Y){B+=ah}}}if(a.utils.typeOf(ag)=="undefined"){ag=K.elements}ac.width=ah;if(o){_css(K[aa],ac)}else{var af=P(aa,ag,ac);if(j.skin.getSkinElement("controlbar",aa+"Over")!==undefined){af.onmouseover=function(ai){af.style.backgroundImage=["url(",j.skin.getSkinElement("controlbar",aa+"Over").src,")"].join("")};af.onmouseout=function(ai){af.style.backgroundImage=["url(",j.skin.getSkinElement("controlbar",aa).src,")"].join("")}}}}}function C(){j.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_LOADED,y);j.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_BUFFER,s);j.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE,q);j.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_TIME,D);j.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE,V);j.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_VOLUME,l);j.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_COMPLETE,G)}function y(){I();H();u();T()}function T(){D({id:j.id,duration:j.jwGetDuration(),position:0});s({id:j.id,bufferProgress:0});V({id:j.id,mute:j.jwGetMute()});q({id:j.id,newstate:a.api.events.state.IDLE});l({id:j.id,volume:j.jwGetVolume()})}function L(Z,aa,Y){if(o){return}if(j.skin.getSkinElement("controlbar",Z)!==undefined){var X=K[Z];if(X!==null){_css(X,{cursor:"pointer"});if(aa=="fullscreen"){X.onmouseup=function(ab){ab.stopPropagation();j.jwSetFullscreen(!j.jwGetFullscreen())}}else{X.onmouseup=function(ab){ab.stopPropagation();if(Y!==null){j[aa](Y)}else{j[aa]()}}}}}}function N(X){if(o){return}var Y=K[X+"Slider"];_css(K.elements,{cursor:"pointer"});_css(Y,{cursor:"pointer"});Y.onmousedown=function(Z){t=X};Y.onmouseup=function(Z){Z.stopPropagation();U(Z.pageX)};Y.onmousemove=function(Z){if(t=="time"){f=true;var aa=Z.pageX-c[X+"Slider"].left-window.pageXOffset;_css(K.timeSliderThumb,{left:aa})}}}function U(Y){f=false;var X;if(t=="time"){X=Y-c.timeSliderRail.left+window.pageXOffset;var aa=X/c.timeSliderRail.width*S;if(aa<0){aa=0}else{if(aa>S){aa=S-3}}if(j.jwGetState()==a.api.events.state.PAUSED||j.jwGetState()==a.api.events.state.IDLE){j.jwPlay()}j.jwSeek(aa)}else{if(t=="volume"){X=Y-c.volumeSliderRail.left-window.pageXOffset;var Z=Math.round(X/c.volumeSliderRail.width*100);if(Z<0){Z=0}else{if(Z>100){Z=100}}if(j.jwGetMute()){j.jwSetMute(false)}j.jwSetVolume(Z)}}t="none"}function s(Y){if(Y.bufferPercent!==null){e=Y.bufferPercent}if(c.timeSliderRail){var Z=c.timeSliderRail.width;var X=isNaN(Math.round(Z*e/100))?0:Math.round(Z*e/100);_css(K.timeSliderBuffer,{width:X})}}function V(X){if(X.mute){_hide(K.muteButton);_show(K.unmuteButton);_hide(K.volumeSliderProgress)}else{_show(K.muteButton);_hide(K.unmuteButton);_show(K.volumeSliderProgress)}}function q(X){if(X.newstate==a.api.events.state.BUFFERING||X.newstate==a.api.events.state.PLAYING){_show(K.pauseButton);_hide(K.playButton)}else{_hide(K.pauseButton);_show(K.playButton)}x();if(X.newstate==a.api.events.state.IDLE){_hide(K.timeSliderBuffer);_hide(K.timeSliderProgress);_hide(K.timeSliderThumb);D({id:j.id,duration:j.jwGetDuration(),position:0})}else{_show(K.timeSliderBuffer);if(X.newstate!=a.api.events.state.BUFFERING){_show(K.timeSliderProgress);_show(K.timeSliderThumb)}}}function G(X){s({bufferPercent:0});D(a.utils.extend(X,{position:0,duration:S}))}function D(aa){if(aa.position!==null){i=aa.position}if(aa.duration!==null){S=aa.duration}var Y=(i===S===0)?0:i/S;var ab=c.timeSliderRail;if(ab){var X=isNaN(Math.round(ab.width*Y))?0:Math.round(ab.width*Y);var Z=X;if(K.timeSliderProgress){K.timeSliderProgress.style.width=X+"px";if(!f){if(K.timeSliderThumb){K.timeSliderThumb.style.left=Z+"px"}}}}if(K.durationText){K.durationText.innerHTML=n(S)}if(K.elapsedText){K.elapsedText.innerHTML=n(i)}}function n(X){str="00:00";if(X>0){str=Math.floor(X/60)<10?"0"+Math.floor(X/60)+":":Math.floor(X/60)+":";str+=Math.floor(X%60)<10?"0"+Math.floor(X%60):Math.floor(X%60)}return str}function m(){var aa,Y;var Z=document.getElementById(R.id+"_elements").childNodes;for(var X in document.getElementById(R.id+"_elements").childNodes){if(isNaN(parseInt(X,10))){continue}if(Z[X].id.indexOf(R.id+"_divider")===0&&Y&&Y.id.indexOf(R.id+"_divider")===0&&Z[X].style.backgroundImage==Y.style.backgroundImage){Z[X].style.display="none"}else{if(Z[X].id.indexOf(R.id+"_divider")===0&&aa&&aa.style.display!="none"){Z[X].style.display="block"}}if(Z[X].style.display!="none"){Y=Z[X]}aa=Z[X]}}function u(){m();if(j.jwGetFullscreen()){_show(K.normalscreenButton);_hide(K.fullscreenButton)}else{_hide(K.normalscreenButton);_show(K.fullscreenButton)}var Y={width:d};var X={};if(A.position==a.html5.view.positions.OVER||j.jwGetFullscreen()){Y.left=A.margin;Y.width-=2*A.margin;Y.top=w-E().height-A.margin;Y.height=E().height}else{Y.left=0}var aa=j.skin.getSkinElement("controlbar","capLeft");var Z=j.skin.getSkinElement("controlbar","capRight");X.left=aa?aa.width:0;X.width=Y.width-X.left-(Z?Z.width:0);var ab=j.skin.getSkinElement("controlbar","timeSliderCapLeft")===undefined?0:j.skin.getSkinElement("controlbar","timeSliderCapLeft").width;_css(K.timeSliderRail,{width:(X.width-Q-B),left:ab});if(K.timeSliderCapRight!==undefined){_css(K.timeSliderCapRight,{left:ab+(X.width-Q-B)})}_css(R,Y);_css(K.elements,X);_css(K.background,X);p();return Y}function l(ab){if(K.volumeSliderRail!==undefined){var Z=isNaN(ab.volume/100)?1:ab.volume/100;var aa=parseInt(K.volumeSliderRail.style.width.replace("px",""),10);var X=isNaN(Math.round(aa*Z))?0:Math.round(aa*Z);var ac=parseInt(K.volumeSliderRail.style.right.replace("px",""),10);var Y=j.skin.getSkinElement("controlbar","volumeSliderCapLeft")===undefined?0:j.skin.getSkinElement("controlbar","volumeSliderCapLeft").width;_css(K.volumeSliderProgress,{width:X,left:Y});if(K.volumeSliderCapLeft!==undefined){_css(K.volumeSliderCapLeft,{left:0})}}}function r(){I();H();p();o=true;C();T();R.style.opacity=A.idlehide?0:1}r();return this}})(jwplayer);(function(b){var a=["width","height","state","playlist","item","position","buffer","duration","volume","mute","fullscreen"];b.html5.controller=function(t,r,e,q){var w=t;var y=e;var d=q;var k=r;var A=true;var c=-1;var u=(y.config.debug!==undefined)&&(y.config.debug.toString().toLowerCase()=="console");var i=new b.html5.eventdispatcher(k.id,u);b.utils.extend(this,i);function m(D){i.sendEvent(D.type,D)}y.addGlobalListener(m);function p(){try{if(y.playlist[y.item].levels[0].file.length>0){if(A||y.state==b.api.events.state.IDLE){y.addEventListener(b.api.events.JWPLAYER_MEDIA_BUFFER_FULL,function(){y.getMedia().play()});y.addEventListener(b.api.events.JWPLAYER_MEDIA_TIME,function(E){if(E.position>=y.playlist[y.item].start&&c>=0){y.playlist[y.item].start=c;c=-1}});if(y.config.repeat){y.addEventListener(b.api.events.JWPLAYER_MEDIA_COMPLETE,function(E){setTimeout(n,25)})}y.getMedia().load(y.playlist[y.item]);A=false}else{if(y.state==b.api.events.state.PAUSED){y.getMedia().play()}}}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function B(){try{if(y.playlist[y.item].levels[0].file.length>0){switch(y.state){case b.api.events.state.PLAYING:case b.api.events.state.BUFFERING:y.getMedia().pause();break}}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function x(D){try{if(y.playlist[y.item].levels[0].file.length>0){if(typeof D!="number"){D=parseFloat(D)}switch(y.state){case b.api.events.state.IDLE:if(c<0){c=y.playlist[y.item].start;y.playlist[y.item].start=D}p();break;case b.api.events.state.PLAYING:case b.api.events.state.PAUSED:case b.api.events.state.BUFFERING:y.seek(D);break}}return true}catch(E){i.sendEvent(b.api.events.JWPLAYER_ERROR,E)}return false}function j(){try{if(y.playlist[y.item].levels[0].file.length>0&&y.state!=b.api.events.state.IDLE){y.getMedia().stop()}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function g(){try{if(y.playlist[y.item].levels[0].file.length>0){if(y.config.shuffle){o(s())}else{if(y.item+1==y.playlist.length){o(0)}else{o(y.item+1)}}}if(y.state!=b.api.events.state.PLAYING&&y.state!=b.api.events.state.BUFFERING){p()}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function f(){try{if(y.playlist[y.item].levels[0].file.length>0){if(y.config.shuffle){o(s())}else{if(y.item===0){o(y.playlist.length-1)}else{o(y.item-1)}}}if(y.state!=b.api.events.state.PLAYING&&y.state!=b.api.events.state.BUFFERING){p()}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function s(){var D=null;if(y.playlist.length>1){while(D===null){D=Math.floor(Math.random()*y.playlist.length);if(D==y.item){D=null}}}else{D=0}return D}function o(E){y.resetEventListeners();y.addGlobalListener(m);try{if(y.playlist[E].levels[0].file.length>0){var F=y.state;if(F!==b.api.events.state.IDLE){j()}y.item=E;A=true;y.setActiveMediaProvider(y.playlist[y.item]);i.sendEvent(b.api.events.JWPLAYER_PLAYLIST_ITEM,{index:E});if(F==b.api.events.state.PLAYING||F==b.api.events.state.BUFFERING||y.config.chromeless||e.config.autostart===true){p()}}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function z(E){try{switch(typeof(E)){case"number":y.getMedia().volume(E);break;case"string":y.getMedia().volume(parseInt(E,10));break}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function l(E){try{if(typeof E=="undefined"){y.getMedia().mute(!y.mute)}else{if(E.toString().toLowerCase()=="true"){y.getMedia().mute(true)}else{y.getMedia().mute(false)}}return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function h(E,D){try{y.width=E;y.height=D;d.resize(E,D);i.sendEvent(b.api.events.JWPLAYER_RESIZE,{width:y.width,height:y.height});return true}catch(F){i.sendEvent(b.api.events.JWPLAYER_ERROR,F)}return false}function v(E){try{if(typeof E=="undefined"){y.fullscreen=!y.fullscreen;d.fullscreen(!y.fullscreen)}else{if(E.toString().toLowerCase()=="true"){y.fullscreen=true;d.fullscreen(true)}else{y.fullscreen=false;d.fullscreen(false)}}i.sendEvent(b.api.events.JWPLAYER_RESIZE,{width:y.width,height:y.height});i.sendEvent(b.api.events.JWPLAYER_FULLSCREEN,{fullscreen:E});return true}catch(D){i.sendEvent(b.api.events.JWPLAYER_ERROR,D)}return false}function C(D){try{j();y.loadPlaylist(D);o(y.item);return true}catch(E){i.sendEvent(b.api.events.JWPLAYER_ERROR,E)}return false}b.html5.controller.repeatoptions={LIST:"LIST",ALWAYS:"ALWAYS",SINGLE:"SINGLE",NONE:"NONE"};function n(){y.resetEventListeners();y.addGlobalListener(m);switch(y.config.repeat.toUpperCase()){case b.html5.controller.repeatoptions.SINGLE:p();break;case b.html5.controller.repeatoptions.ALWAYS:if(y.item==y.playlist.length-1&&!y.config.shuffle){o(0);p()}else{g()}break;case b.html5.controller.repeatoptions.LIST:if(y.item==y.playlist.length-1&&!y.config.shuffle){o(0)}else{g()}break}}this.play=p;this.pause=B;this.seek=x;this.stop=j;this.next=g;this.prev=f;this.item=o;this.setVolume=z;this.setMute=l;this.resize=h;this.setFullscreen=v;this.load=C}})(jwplayer);(function(a){a.html5.defaultSkin=function(){this.text='<?xml version="1.0" ?><skin author="LongTail Video" name="Five" version="1.0"><settings><setting name="backcolor" value="0xFFFFFF"/><setting name="frontcolor" value="0x000000"/><setting name="lightcolor" value="0x000000"/><setting name="screencolor" value="0x000000"/></settings><components><component name="controlbar"><settings><setting name="margin" value="20"/><setting name="fontsize" value="11"/></settings><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAIAAABvFaqvAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFJJREFUeNrslLENwAAIwxLU/09j5AiOgD5hVQzNAVY8JK4qEfHMIKBnd2+BQlBINaiRtL/aV2rdzYBsM6CIONbI1NZENTr3RwdB2PlnJgJ6BRgA4hwu5Qg5iswAAAAASUVORK5CYII="/><element name="capLeft" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD5JREFUeNosi8ENACAMAgnuv14H0Z8asI19XEjhOiKCMmibVgJTUt7V6fe9KXOtSQCfctJHu2q3/ot79hNgANc2OTz9uTCCAAAAAElFTkSuQmCC"/><element name="capRight" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD5JREFUeNosi8ENACAMAgnuv14H0Z8asI19XEjhOiKCMmibVgJTUt7V6fe9KXOtSQCfctJHu2q3/ot79hNgANc2OTz9uTCCAAAAAElFTkSuQmCC"/><element name="divider" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAAYCAIAAAC0rgCNAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD5JREFUeNosi8ENACAMAgnuv14H0Z8asI19XEjhOiKCMmibVgJTUt7V6fe9KXOtSQCfctJHu2q3/ot79hNgANc2OTz9uTCCAAAAAElFTkSuQmCC"/><element name="playButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEhJREFUeNpiYqABYBo1dNRQ+hr6H4jvA3E8NS39j4SpZvh/LJig4YxEGEqy3kET+w+AOGFQRhTJhrEQkGcczfujhg4CQwECDADpTRWU/B3wHQAAAABJRU5ErkJggg=="/><element name="pauseButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAChJREFUeNpiYBgFo2DwA0YC8v/R1P4nRu+ooaOGUtnQUTAKhgIACDAAFCwQCfAJ4gwAAAAASUVORK5CYII="/><element name="prevButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEtJREFUeNpiYBgFo2Dog/9QDAPyQHweTYwiQ/2B+D0Wi8g2tB+JTdBQRiIMJVkvEy0iglhDF9Aq9uOpHVEwoE+NJDUKRsFgAAABBgDe2hqZcNNL0AAAAABJRU5ErkJggg=="/><element name="nextButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAElJREFUeNpiYBgFo2Dog/9AfB6I5dHE/lNqKAi/B2J/ahsKw/3EGMpIhKEk66WJoaR6fz61IyqemhEFSlL61ExSo2AUDAYAEGAAiG4hj+5t7M8AAAAASUVORK5CYII="/><element name="timeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADxJREFUeNpiYBgFo2AU0Bwwzluw+D8tLWARFhKiqQ9YuLg4aWsBGxs7bS1gZ6e5BWyjSX0UjIKhDgACDABlYQOGh5pYywAAAABJRU5ErkJggg=="/><element name="timeSliderBuffer" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpiYBgFo2AU0Bww1jc0/aelBSz8/Pw09QELOzs7bS1gY2OjrQWsrKy09gHraFIfBaNgqAOAAAMAvy0DChXHsZMAAAAASUVORK5CYII="/><element name="timeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAClJREFUeNpiYBgFo2AU0BwwAvF/WlrARGsfjFow8BaMglEwCugAAAIMAOHfAQunR+XzAAAAAElFTkSuQmCC"/><element name="timeSliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAICAYAAAA870V8AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABZJREFUeNpiZICA/yCCiQEJUJcDEGAAY0gBD1/m7Q0AAAAASUVORK5CYII="/><element name="muteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADFJREFUeNpiYBgFIw3MB+L/5Gj8j6yRiRTFyICJXHfTXyMLAXlGati4YDRFDj8AEGAABk8GSqqS4CoAAAAASUVORK5CYII="/><element name="unmuteButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAD1JREFUeNpiYBgFgxz8p7bm+cQa+h8LHy7GhEcjIz4bmAjYykiun/8j0fakGPIfTfPgiSr6aB4FVAcAAQYAWdwR1G1Wd2gAAAAASUVORK5CYII="/><element name="volumeSliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAGpJREFUeNpi/P//PwM9ABMDncCoRYPfIqqDZcuW1UPp/6AUDcNM1DQYKtRAlaAj1mCSLSLXYIIWUctgDItoZfDA5aOoqKhGEANIM9LVR7SymGDQUctikuOIXkFNdhHEOFrDjlpEd4sAAgwAriRMub95fu8AAAAASUVORK5CYII="/><element name="volumeSliderProgress" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAYCAYAAADkgu3FAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFtJREFUeNpi/P//PwM9ABMDncCoRYPfIlqAeij9H5SiYZiqBqPTlFqE02BKLSLaYFItIttgQhZRzWB8FjENiuRJ7aAbsMQwYMl7wDIsWUUQ42gNO2oR3S0CCDAAKhKq6MLLn8oAAAAASUVORK5CYII="/><element name="fullscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAE5JREFUeNpiYBgFo2DQA0YC8v/xqP1PjDlMRDrEgUgxkgHIlfZoriVGjmzLsLFHAW2D6D8eA/9Tw7L/BAwgJE90PvhPpNgoGAVDEQAEGAAMdhTyXcPKcAAAAABJRU5ErkJggg=="/><element name="normalscreenButton" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEZJREFUeNpiYBgFo2DIg/9UUkOUAf8JiFFsyX88fJyAkcQgYMQjNkzBoAgiezyRbE+tFGSPxQJ7auYBmma0UTAKBhgABBgAJAEY6zON61sAAAAASUVORK5CYII="/></elements></component><component name="display"><elements><element name="background" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEpJREFUeNrszwENADAIA7DhX8ENoBMZ5KR10EryckCJiIiIiIiIiIiIiIiIiIiIiIh8GmkRERERERERERERERERERERERGRHSPAAPlXH1phYpYaAAAAAElFTkSuQmCC"/><element name="playIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALdJREFUeNrs18ENgjAYhmFouDOCcQJGcARHgE10BDcgTOIosAGwQOuPwaQeuFRi2p/3Sb6EC5L3QCxZBgAAAOCorLW1zMn65TrlkH4NcV7QNcUQt7Gn7KIhxA+qNIR81spOGkL8oFJDyLJRdosqKDDkK+iX5+d7huzwM40xptMQMkjIOeRGo+VkEVvIPfTGIpKASfYIfT9iCHkHrBEzf4gcUQ56aEzuGK/mw0rHpy4AAACAf3kJMACBxjAQNRckhwAAAABJRU5ErkJggg=="/><element name="muteIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHJJREFUeNrs1jEOgCAMBVAg7t5/8qaoIy4uoobyXsLCxA+0NCUAAADGUWvdQoQ41x4ixNBB2hBvBskdD3w5ZCkl3+33VqI0kjBBlh9rp+uTcyOP33TnolfsU85XX3yIRpQph8ZQY3wTZtU5AACASA4BBgDHoVuY1/fvOQAAAABJRU5ErkJggg=="/><element name="errorIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAWlJREFUeNrsl+1twjAQhsHq/7BBYQLYIBmBDcoGMAIjtBPQTcII2SDtBDBBwrU6pGsUO7YbO470PtKJkz9iH++d4ywWAAAAAABgljRNsyWr2bZzDuJG1rLdZhcMbTjrBCGDyUKsqQLFciJb9bSvuG/WagRVRUVUI6gqy5HVeKWfSgRyJruKIU//TrZTSn2nmlaXThrloi/v9F2STC1W4+Aw5cBzkquRc09bofFNc6YLxEON0VUZS5FPTftO49vMjRsIF3RhOGr7/D/pJw+FKU+q0vDyq8W42jCunDqI3LC5XxNj2wHLU1XjaRnb0Lhykhqhhd8MtSF5J9tbjCv4mXGvKJz/65FF/qJryyaaIvzP2QRxZTX2nTuXjvV/VPFSwyLnW7mpH99yTh1FEVro6JBSd40/pMrRdV8vPtcKl28T2pT8TnFZ4yNosct3Q0io6JfBiz1FlGdqVQH3VHnepAEAAAAAADDzEGAAcTwB10jWgxcAAAAASUVORK5CYII="/><element name="bufferIcon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAuhJREFUeNrsWr9rU1EUznuNGqvFQh1ULOhiBx0KDtIuioO4pJuik3FxFfUPaAV1FTdx0Q5d2g4FFxehTnEpZHFoBy20tCIWtGq0TZP4HfkeHB5N8m6Sl/sa74XDybvv3vvOd8/Pe4lXrVZT3dD8VJc0B8QBcUAcEAfESktHGeR5XtMfqFQq/f92zPe/NbtGlKTdCY30kuxrpMGO94BlQCXs+rbh3ONgA6BlzP1p20d80gEI5hmA2A92Qua1Q2PtAFISM+bvjMG8U+Q7oA3rQGASwrYCU6WpNdLGYbA+Pq5jjXIiwi8EEa2UDbQSaKOIuV+SlkcCrfjY8XTI9EpKGwP0C2kru2hLtHqa4zoXtZRWyvi4CLwv9Opr6Hkn6A9HKgEANsQ1iqC3Ub/vRUk2JgmRkatK36kVrnt0qObunwUdUUMXMWYpakJsO5Am8tAw2GBIgwWA+G2S2dMpiw0gDioQRQJoKhRb1QiDwlHZUABYbaXWsm5ae6loTE4ZDxN4CZar8foVzOJ2iyZ2kWF3t7YIevffaMT5yJ70kQb2fQ1sE5SHr2wazs2wgMxgbsEKEAgxAvZUJbQLBGTSBMgNrncJbA6AljtS/eKDJ0Ez+DmrQEzXS2h1Ck25kAg0IZcUOaydCy4sYnN2fOA+2AP16gNoHALlQ+fwH7XO4CxLenUpgj4xr6ugY2roPMbMx+Xs18m/E8CVEIhxsNeg83XWOAN6grG3lGbk8uE5fr4B/WH3cJw+co/l9nTYsSGYCJ/lY5/qv0thn6nrIWmjeJcPSnWOeY++AkF8tpJHIMAUs/MaBBpj3znZfQo5psY+ZrG4gv5HickjEOymKjEeRpgyST6IuZcTcWbnjcgdPi5ghxciRKsl1lDSsgwA1i8fssonJgzmTSqfGUkCENndNdAL7PS6QQ7ZYISTo+1qq0LEWjTWcvY4isa4z+yfQB+7ooyHVg5RI7/i1Ijn/vnggDggDogD4oC00P4KMACd/juEHOrS4AAAAABJRU5ErkJggg=="/></elements></component><component name="dock"><elements><element name="button" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAFBJREFUeNrs0cEJACAQA8Eofu0fu/W6EM5ZSAFDRpKTBs00CQQEBAQEBAQEBAQEBAQEBATkK8iqbY+AgICAgICAgICAgICAgICAgIC86QowAG5PAQzEJ0lKAAAAAElFTkSuQmCC"/></elements></component><component name="playlist"><elements><element name="item" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAIAAAC1nk4lAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAHhJREFUeNrs2NEJwCAMBcBYuv/CFuIE9VN47WWCR7iocXR3pdWdGPqqwIoMjYfQeAiNh9B4JHc6MHQVHnjggQceeOCBBx77TifyeOY0iHi8DqIdEY8dD5cL094eePzINB5CO/LwcOTptNB4CP25L4TIbZzpU7UEGAA5wz1uF5rF9AAAAABJRU5ErkJggg=="/><element name="sliderRail" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAA8CAIAAADpFA0BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADhJREFUeNrsy6ENACAMAMHClp2wYxZLAg5Fcu9e3OjuOKqqfTMzbs14CIZhGIZhGIZhGP4VLwEGAK/BBnVFpB0oAAAAAElFTkSuQmCC"/><element name="sliderThumb" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAA8CAIAAADpFA0BAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADRJREFUeNrsy7ENACAMBLE8++8caFFKKiRffU53112SGs3ttOohGIZhGIZhGIZh+Fe8BRgAiaUGde6NOSEAAAAASUVORK5CYII="/></elements></component></components></skin>';this.xml=null;if(window.DOMParser){parser=new DOMParser();this.xml=parser.parseFromString(this.text,"text/xml")}else{this.xml=new ActiveXObject("Microsoft.XMLDOM");this.xml.async="false";this.xml.loadXML(this.text)}return this}})(jwplayer);(function(a){_css=a.utils.css;_hide=function(b){_css(b,{display:"none"})};_show=function(b){_css(b,{display:"block"})};a.html5.display=function(o,z){var r={icons:true};var j=a.utils.extend({},r,z);var w=o;var d={};var f;var A;var k;var x;var y;var p;var i;var n=w.skin.getComponentSettings("display").bufferrotation===undefined?15:parseInt(w.skin.getComponentSettings("display").bufferrotation,10);var e=w.skin.getComponentSettings("display").bufferinterval===undefined?100:parseInt(w.skin.getComponentSettings("display").bufferinterval,10);var c={display:{style:{cursor:"pointer",top:0,left:0,overflow:"hidden"},click:u},display_icon:{style:{cursor:"pointer",position:"absolute",top:((w.skin.getSkinElement("display","background").height-w.skin.getSkinElement("display","playIcon").height)/2),left:((w.skin.getSkinElement("display","background").width-w.skin.getSkinElement("display","playIcon").width)/2),border:0,margin:0,padding:0,zIndex:3}},display_iconBackground:{style:{cursor:"pointer",position:"absolute",top:((A-w.skin.getSkinElement("display","background").height)/2),left:((f-w.skin.getSkinElement("display","background").width)/2),border:0,backgroundImage:(["url(",w.skin.getSkinElement("display","background").src,")"]).join(""),width:w.skin.getSkinElement("display","background").width,height:w.skin.getSkinElement("display","background").height,margin:0,padding:0,zIndex:2}},display_image:{style:{display:"none",width:f,height:A,position:"absolute",cursor:"pointer",left:0,top:0,margin:0,padding:0,textDecoration:"none",zIndex:1}},display_text:{style:{zIndex:4,position:"relative",opacity:0.8,backgroundColor:parseInt("000000",16),color:parseInt("ffffff",16),textAlign:"center",fontFamily:"Arial,sans-serif",padding:"0 5px",fontSize:14}}};w.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE,l);w.jwAddEventListener(a.api.events.JWPLAYER_MEDIA_MUTE,l);w.jwAddEventListener(a.api.events.JWPLAYER_PLAYLIST_ITEM,l);w.jwAddEventListener(a.api.events.JWPLAYER_ERROR,t);B();function B(){d.display=s("div","display");d.display_text=s("div","display_text");d.display.appendChild(d.display_text);d.display_image=s("img","display_image");d.display_image.onerror=function(C){_hide(d.display_image)};d.display_image.onload=m;d.display_icon=s("div","display_icon");d.display_iconBackground=s("div","display_iconBackground");d.display.appendChild(d.display_image);d.display_iconBackground.appendChild(d.display_icon);d.display.appendChild(d.display_iconBackground);b()}this.getDisplayElement=function(){return d.display};this.resize=function(D,C){f=D;A=C;_css(d.display,{width:D,height:C});_css(d.display_text,{width:(D-10),top:((A-d.display_text.getBoundingClientRect().height)/2)});_css(d.display_iconBackground,{top:((A-w.skin.getSkinElement("display","background").height)/2),left:((f-w.skin.getSkinElement("display","background").width)/2)});h();l({})};this.show=function(){_show(d.display_icon);_show(d.display_iconBackground)};this.hide=function(){q()};function m(C){k=d.display_image.naturalWidth;x=d.display_image.naturalHeight;h()}function h(){a.utils.stretch(w.jwGetStretching(),d.display_image,f,A,k,x)}function s(C,E){var D=document.createElement(C);D.id=w.id+"_jwplayer_"+E;_css(D,c[E].style);return D}function b(){for(var C in d){if(c[C].click!==undefined){d[C].onclick=c[C].click}}}function u(C){if(typeof C.preventDefault!="undefined"){C.preventDefault()}else{C.returnValue=false}if(w.jwGetState()!=a.api.events.state.PLAYING){w.jwPlay()}else{w.jwPause()}}function g(C){if(i||!j.icons){q();return}_show(d.display_iconBackground);d.display_icon.style.backgroundImage=(["url(",w.skin.getSkinElement("display",C).src,")"]).join("");_css(d.display_icon,{display:"block",width:w.skin.getSkinElement("display",C).width,height:w.skin.getSkinElement("display",C).height,top:(w.skin.getSkinElement("display","background").height-w.skin.getSkinElement("display",C).height)/2,left:(w.skin.getSkinElement("display","background").width-w.skin.getSkinElement("display",C).width)/2});if(w.skin.getSkinElement("display",C+"Over")!==undefined){d.display_icon.onmouseover=function(D){d.display_icon.style.backgroundImage=["url(",w.skin.getSkinElement("display",C+"Over").src,")"].join("")};d.display_icon.onmouseout=function(D){d.display_icon.style.backgroundImage=["url(",w.skin.getSkinElement("display",C).src,")"].join("")}}else{d.display_icon.onmouseover=null;d.display_icon.onmouseout=null}}function q(){_hide(d.display_icon);_hide(d.display_iconBackground)}function t(C){i=true;q();d.display_text.innerHTML=C.error;_show(d.display_text);d.display_text.style.top=((A-d.display_text.getBoundingClientRect().height)/2)+"px"}function v(){var C=d.display_image;d.display_image=s("img","display_image");d.display_image.onerror=function(D){_hide(d.display_image)};d.display_image.onload=m;d.display.replaceChild(d.display_image,C)}function l(C){if((C.type==a.api.events.JWPLAYER_PLAYER_STATE||C.type==a.api.events.JWPLAYER_PLAYLIST_ITEM)&&i){i=false;_hide(d.display_text)}if(p!==undefined){clearInterval(p);p=null;a.utils.animations.rotate(d.display_icon,0)}switch(w.jwGetState()){case a.api.events.state.BUFFERING:g("bufferIcon");y=0;p=setInterval(function(){y+=n;a.utils.animations.rotate(d.display_icon,y%360)},e);g("bufferIcon");break;case a.api.events.state.PAUSED:if(w.jwGetPlaylist()[w.jwGetItem()].provider!="sound"){_css(d.display_image,{background:"transparent no-repeat center center"})}g("playIcon");break;case a.api.events.state.IDLE:if(w.jwGetPlaylist()[w.jwGetItem()].image){_css(d.display_image,{display:"block"});d.display_image.src=a.utils.getAbsolutePath(w.jwGetPlaylist()[w.jwGetItem()].image)}else{v()}g("playIcon");break;default:if(w.jwGetMute()&&j.showmute){if(w.jwGetPlaylist()[w.jwGetItem()].provider!="sound"){v()}g("muteIcon")}else{if(w.jwGetPlaylist()[w.jwGetItem()].provider!="sound"){v()}_hide(d.display_iconBackground);_hide(d.display_icon)}break}}return this}})(jwplayer);(function(a){_css=a.utils.css;a.html5.dock=function(g,c){function f(){return{align:a.html5.view.positions.RIGHT}}var k=a.utils.extend({},f(),c);if(k.align=="FALSE"){return}var h={};var b=[];var d;var e;var j=document.createElement("div");j.id=g.id+"_jwplayer_dock";this.getDisplayElement=function(){return j};this.setButton=function(o,l,m,n){if(!l&&h[o]){a.utils.arrays.remove(b,o);j.removeChild(h[o].div);delete h[o]}else{if(l){if(!h[o]){h[o]={}}h[o].handler=l;h[o].outGraphic=m;h[o].overGraphic=n;if(!h[o].div){b.push(o);h[o].div=document.createElement("div");h[o].div.style.position="relative";j.appendChild(h[o].div);h[o].div.appendChild(document.createElement("img"));h[o].div.childNodes[0].style.position="absolute";h[o].div.childNodes[0].style.left=0;h[o].div.childNodes[0].style.top=0;h[o].div.childNodes[0].style.zIndex=10;h[o].div.childNodes[0].style.cursor="pointer";h[o].div.appendChild(document.createElement("img"));h[o].div.childNodes[1].style.position="absolute";h[o].div.childNodes[1].style.left=0;h[o].div.childNodes[1].style.top=0;if(g.skin.getSkinElement("dock","button")){h[o].div.childNodes[1].src=g.skin.getSkinElement("dock","button").src}h[o].div.childNodes[1].style.zIndex=9;h[o].div.childNodes[1].style.cursor="pointer";h[o].div.onmouseover=function(){if(h[o].overGraphic){h[o].div.childNodes[0].src=h[o].overGraphic}if(g.skin.getSkinElement("dock","buttonOver")){h[o].div.childNodes[1].src=g.skin.getSkinElement("dock","buttonOver").src}};h[o].div.onmouseout=function(){if(h[o].outGraphic){h[o].div.childNodes[0].src=h[o].outGraphic}if(g.skin.getSkinElement("dock","button")){h[o].div.childNodes[1].src=g.skin.getSkinElement("dock","button").src}};if(h[o].overGraphic){h[o].div.childNodes[0].src=h[o].overGraphic}if(h[o].outGraphic){h[o].div.childNodes[0].src=h[o].outGraphic}if(g.skin.getSkinElement("dock","button")){h[o].div.childNodes[1].src=g.skin.getSkinElement("dock","button").src}}if(l){h[o].div.onclick=function(p){p.preventDefault();a(g.id).callback(o);if(h[o].overGraphic){h[o].div.childNodes[0].src=h[o].overGraphic}if(g.skin.getSkinElement("dock","button")){h[o].div.childNodes[1].src=g.skin.getSkinElement("dock","button").src}}}}}i(d,e)};function i(n,l){d=n;e=l;if(b.length>0){var p=10;var r=n-g.skin.getSkinElement("dock","button").width-p;var o=p;var q=-1;if(k.align==a.html5.view.positions.LEFT){q=1;r=p}for(var m=0;m<b.length;m++){var s=Math.floor(o/l);if((o+g.skin.getSkinElement("dock","button").height+p)>((s+1)*l)){o=((s+1)*l)+p;s=Math.floor(o/l)}h[b[m]].div.style.top=(o%l)+"px";h[b[m]].div.style.left=(r+(g.skin.getSkinElement("dock","button").width+p)*s*q)+"px";o+=g.skin.getSkinElement("dock","button").height+p}}}this.resize=i;this.show=function(){_css(j,{display:"block"})};this.hide=function(){_css(j,{display:"none"})};return this}})(jwplayer);(function(a){a.html5.eventdispatcher=function(d,b){var c=new a.events.eventdispatcher(b);a.utils.extend(this,c);this.sendEvent=function(e,f){if(f===undefined){f={}}a.utils.extend(f,{id:d,version:a.version,type:e});c.sendEvent(e,f)}}})(jwplayer);(function(a){var b={prefix:"http://l.longtailvideo.com/html5/",file:"logo.png",link:"http://www.longtailvideo.com/players/jw-flv-player/",margin:8,out:0.5,over:1,timeout:3,hide:true,position:"bottom-left"};_css=a.utils.css;a.html5.logo=function(l,m){var r=l;var n;var i;var c;j();function j(){p();d();f()}function p(){if(b.prefix){var t=l.version.split(/\W/).splice(0,2).join("/");if(b.prefix.indexOf(t)<0){b.prefix+=t+"/"}}if(m.position==a.html5.view.positions.OVER){m.position=b.position}i=a.utils.extend({},b)}function d(){c=document.createElement("img");c.id=r.id+"_jwplayer_logo";c.style.display="none";c.onload=function(t){_css(c,q());r.jwAddEventListener(a.api.events.JWPLAYER_PLAYER_STATE,s);e()};if(!i.file){return}if(i.file.indexOf("http://")===0){c.src=i.file}else{c.src=i.prefix+i.file}}if(!i.file){return}this.resize=function(u,t){};this.getDisplayElement=function(){return c};function f(){if(i.link){c.onmouseover=h;c.onmouseout=e;c.onclick=o}else{this.mouseEnabled=false}}function o(t){if(typeof t!="undefined"){t.stopPropagation()}r.jwPause();r.jwSetFullscreen(false);if(i.link){window.open(i.link,"_blank")}return}function e(t){if(i.link){c.style.opacity=i.out}return}function h(t){if(i.hide){c.style.opacity=i.over}return}function q(){var v={textDecoration:"none",position:"absolute",cursor:"pointer"};v.display=i.hide?"none":"block";var u=i.position.toLowerCase().split("-");for(var t in u){v[u[t]]=i.margin}return v}function k(){if(i.hide){c.style.display="block";c.style.opacity=0;a.utils.fadeTo(c,i.out,0.1,parseFloat(c.style.opacity));n=setTimeout(function(){g()},i.timeout*1000)}}function g(){if(i.hide){a.utils.fadeTo(c,0,0.1,parseFloat(c.style.opacity))}}function s(t){if(t.newstate==a.api.events.state.BUFFERING){clearTimeout(n);k()}}return this}})(jwplayer);(function(a){var c={ended:a.api.events.state.IDLE,playing:a.api.events.state.PLAYING,pause:a.api.events.state.PAUSED,buffering:a.api.events.state.BUFFERING};var b=a.utils.css;a.html5.mediavideo=function(f,F){var J={abort:t,canplay:m,canplaythrough:m,durationchange:q,emptied:t,ended:m,error:l,loadeddata:q,loadedmetadata:q,loadstart:m,pause:m,play:M,playing:m,progress:B,ratechange:t,seeked:m,seeking:m,stalled:m,suspend:m,timeupdate:M,volumechange:t,waiting:m,canshowcurrentframe:t,dataunavailable:t,empty:t,load:e,loadedfirstframe:t};var K=new a.html5.eventdispatcher();a.utils.extend(this,K);var h=f;var x=F;var G;var I;var d=a.api.events.state.IDLE;var C=null;var n;var g=0;var A=false;var r=false;var O;var N;var i=[];var P;var E=false;function v(){return d}function e(Q){}function t(Q){}function m(Q){if(c[Q.type]){s(c[Q.type])}}function s(Q){if(E){return}if(n){Q=a.api.events.state.IDLE}if(Q==a.api.events.state.PAUSED&&d==a.api.events.state.IDLE){return}if(Q==a.api.events.state.PLAYING&&d==a.api.events.state.IDLE){s(a.api.events.state.BUFFERING);K.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER,{bufferPercent:h.buffer});z();return}if(d!=Q){var R=d;h.state=Q;d=Q;var S=false;if(Q==a.api.events.state.IDLE){p();if(h.position>=h.duration&&(h.position>0||h.duration>0)){S=true}if(x.style.display!="none"&&!h.config.chromeless){x.style.display="none"}}K.sendEvent(a.api.events.JWPLAYER_PLAYER_STATE,{oldstate:R,newstate:Q});if(S){K.sendEvent(a.api.events.JWPLAYER_MEDIA_COMPLETE)}}n=false}function q(Q){var R={height:Q.target.videoHeight,width:Q.target.videoWidth,duration:Math.round(Q.target.duration*10)/10};if(h.duration===0||isNaN(h.duration)){h.duration=Math.round(Q.target.duration*10)/10}h.playlist[h.item]=a.utils.extend(h.playlist[h.item],R);K.sendEvent(a.api.events.JWPLAYER_MEDIA_META,{metadata:R})}function M(R){if(n){return}if(R!==undefined&&R.target!==undefined){if(h.duration===0||isNaN(h.duration)){h.duration=Math.round(R.target.duration*10)/10}if(!A&&x.readyState>0){s(a.api.events.state.PLAYING)}if(d==a.api.events.state.PLAYING){if(!A&&x.readyState>0){A=true;try{x.currentTime=h.playlist[h.item].start}catch(Q){}x.volume=h.volume/100;x.muted=h.mute}h.position=Math.round(R.target.currentTime*10)/10;K.sendEvent(a.api.events.JWPLAYER_MEDIA_TIME,{position:R.target.currentTime,duration:R.target.duration})}}B(R)}function z(){if(G===false&&d==a.api.events.state.BUFFERING){K.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER_FULL);G=true}}function H(){var Q=(i[i.length-1]-i[0])/i.length;P=setTimeout(function(){if(!I){B({lengthComputable:true,loaded:1,total:1})}},Q*10)}function B(S){var R,Q;if(S!==undefined&&S.lengthComputable&&S.total){o();R=S.loaded/S.total*100;Q=R/100*(h.duration-x.currentTime);if(50<R&&!I){clearTimeout(P);H()}}else{if((x.buffered!==undefined)&&(x.buffered.length>0)){maxBufferIndex=0;if(maxBufferIndex>=0){R=x.buffered.end(maxBufferIndex)/x.duration*100;Q=x.buffered.end(maxBufferIndex)-x.currentTime}}}z();if(!I){if(R==100&&I===false){I=true}if(R!==null&&(R>h.buffer)){h.buffer=Math.round(R);K.sendEvent(a.api.events.JWPLAYER_MEDIA_BUFFER,{bufferPercent:Math.round(R)})}}}function w(){if(C===null){C=setInterval(function(){M()},100)}}function p(){clearInterval(C);C=null}function l(S){var R="There was an error: ";if((S.target.error&&S.target.tagName.toLowerCase()=="video")||S.target.parentNode.error&&S.target.parentNode.tagName.toLowerCase()=="video"){var Q=S.target.error===undefined?S.target.parentNode.error:S.target.error;switch(Q.code){case Q.MEDIA_ERR_ABORTED:R="You aborted the video playback: ";break;case Q.MEDIA_ERR_NETWORK:R="A network error caused the video download to fail part-way: ";break;case Q.MEDIA_ERR_DECODE:R="The video playback was aborted due to a corruption problem or because the video used features your browser did not support: ";break;case Q.MEDIA_ERR_SRC_NOT_SUPPORTED:R="The video could not be loaded, either because the server or network failed or because the format is not supported: ";break;default:R="An unknown error occurred: ";break}}else{if(S.target.tagName.toLowerCase()=="source"){N--;if(N>0){return}R="The video could not be loaded, either because the server or network failed or because the format is not supported: "}else{a.utils.log("Erroneous error received. Continuing...");return}}u();R+=j();E=true;K.sendEvent(a.api.events.JWPLAYER_ERROR,{error:R});return}function j(){var S="";for(var R in O.levels){var Q=O.levels[R];var T=x.ownerDocument.createElement("source");S+=a.utils.getAbsolutePath(Q.file);if(R<(O.levels.length-1)){S+=", "}}return S}this.getDisplayElement=function(){return x};this.play=function(){if(d!=a.api.events.state.PLAYING){if(x.style.display!="block"){x.style.display="block"}x.play();w();if(G){s(a.api.events.state.PLAYING)}}};this.pause=function(){x.pause();s(a.api.events.state.PAUSED)};this.seek=function(Q){if(!(h.duration===0||isNaN(h.duration))&&!(h.position===0||isNaN(h.position))){x.currentTime=Q;x.play()}};function u(){x.pause();x.removeAttribute("src");var Q=x.getElementsByTagName("source");for(var R=0;R<Q.length;R++){x.removeChild(Q[R])}if(typeof x.load=="function"){x.load()}p();h.position=0;n=true;s(a.api.events.state.IDLE)}this.stop=u;this.volume=function(Q){x.volume=Q/100;h.volume=Q;K.sendEvent(a.api.events.JWPLAYER_MEDIA_VOLUME,{volume:Math.round(Q)})};this.mute=function(Q){x.muted=Q;h.mute=Q;K.sendEvent(a.api.events.JWPLAYER_MEDIA_MUTE,{mute:Q})};this.resize=function(R,Q){if(false){b(x,{width:R,height:Q})}K.sendEvent(a.api.events.JWPLAYER_MEDIA_RESIZE,{fullscreen:h.fullscreen,width:R,hieght:Q})};this.fullscreen=function(Q){if(Q===true){this.resize("100%","100%")}else{this.resize(h.config.width,h.config.height)}};this.load=function(Q){L(Q);K.sendEvent(a.api.events.JWPLAYER_MEDIA_LOADED);G=false;I=false;A=false;if(!h.config.chromeless&&!r){i=[];o();s(a.api.events.state.BUFFERING);setTimeout(function(){M()},25)}};function o(){var Q=new Date().getTime();i.push(Q)}this.hasChrome=function(){return r};function L(Q){switch(Q.provider){case"youtube":k(Q);break;default:D(Q,document.createElement("video"));break}}function D(X,V){h.duration=X.duration;r=false;O=X;V.preload="none";V.setAttribute("x-webkit-airplay","allow");E=false;N=0;for(var R=0;R<X.levels.length;R++){var Q=X.levels[R];var S;var W=a.utils.extension(Q.file);if(Q.type===undefined){if(a.utils.extensionmap[W]!==undefined&&a.utils.extensionmap[W].html5!==undefined){S=a.utils.extensionmap[W].html5}}else{S=Q.type}if(!S||V.canPlayType(S)||(a.utils.isLegacyAndroid()&&W.match(/m4v|mp4/))){var U=x.ownerDocument.createElement("source");U.src=a.utils.getAbsolutePath(Q.file);if(S&&!a.utils.isLegacyAndroid()){U.type=S}N++;V.appendChild(U)}}if(N===0){E=true;K.sendEvent(a.api.events.JWPLAYER_ERROR,{error:"The media could not be loaded because the format is not supported by your browser: "+j()})}if(h.config.chromeless){V.poster=a.utils.getAbsolutePath(X.image);V.controls="controls"}V.style.top=x.style.top;V.style.left=x.style.left;V.style.width=x.style.width;V.style.height=x.style.height;V.style.zIndex=x.style.zIndex;V.onload=e;V.volume=0;x.parentNode.replaceChild(V,x);V.id=x.id;x=V;for(var T in J){x.addEventListener(T,function(Y){if(Y.target.parentNode!==null){J[Y.type](Y)}},true)}}function k(Q){var Y=Q.levels[0].file;var T=document.createElement("object");Y=["http://www.youtube.com/v/",y(Y),"&amp;hl=en_US&amp;fs=1&autoplay=1"].join("");var W={movie:Y,allowFullScreen:"true",allowscriptaccess:"always"};for(var S in W){var R=document.createElement("param");R.name=S;R.value=W[S];T.appendChild(R)}var X=document.createElement("embed");var U={src:Y,type:"application/x-shockwave-flash",allowscriptaccess:"always",allowfullscreen:"true",width:document.getElementById(f.id).style.width,height:document.getElementById(f.id).style.height};for(var V in U){X[V]=U[V]}T.appendChild(X);T.style.position=x.style.position;T.style.top=x.style.top;T.style.left=x.style.left;T.style.width=document.getElementById(f.id).style.width;T.style.height=document.getElementById(f.id).style.height;T.style.zIndex=2147483000;x.parentNode.replaceChild(T,x);T.id=x.id;x=T;r=true}function y(R){var Q=R.split(/\?|\#\!/);var T="";for(var S=0;S<Q.length;S++){if(Q[S].substr(0,2)=="v="){T=Q[S].substr(2)}}if(T==""){if(R.indexOf("/v/")>=0){T=R.substr(R.indexOf("/v/")+3)}else{if(R.indexOf("youtu.be")>=0){T=R.substr(R.indexOf("youtu.be/")+9)}else{T=R}}}if(T.indexOf("?")>-1){T=T.substr(0,T.indexOf("?"))}if(T.indexOf("&")>-1){T=T.substr(0,T.indexOf("&"))}return T}this.embed=L;return this}})(jwplayer);(function(jwplayer){var _configurableStateVariables=["width","height","start","duration","volume","mute","fullscreen","item","plugins","stretching"];jwplayer.html5.model=function(api,container,options){var _api=api;var _container=container;var _model={id:_container.id,playlist:[],state:jwplayer.api.events.state.IDLE,position:0,buffer:0,config:{width:480,height:320,item:-1,skin:undefined,file:undefined,image:undefined,start:0,duration:0,bufferlength:5,volume:90,mute:false,fullscreen:false,repeat:"none",stretching:jwplayer.utils.stretching.UNIFORM,autostart:false,debug:undefined,screencolor:undefined}};var _media;var _eventDispatcher=new jwplayer.html5.eventdispatcher();var _components=["display","logo","controlbar","dock"];jwplayer.utils.extend(_model,_eventDispatcher);for(var option in options){if(typeof options[option]=="string"){var type=/color$/.test(option)?"color":null;options[option]=jwplayer.utils.typechecker(options[option],type)}var config=_model.config;var path=option.split(".");for(var edge in path){if(edge==path.length-1){config[path[edge]]=options[option]}else{if(config[path[edge]]===undefined){config[path[edge]]={}}config=config[path[edge]]}}}for(var index in _configurableStateVariables){var configurableStateVariable=_configurableStateVariables[index];_model[configurableStateVariable]=_model.config[configurableStateVariable]}var pluginorder=_components.concat([]);if(_model.plugins!==undefined){if(typeof _model.plugins=="string"){var userplugins=_model.plugins.split(",");for(var userplugin in userplugins){if(typeof userplugins[userplugin]=="string"){pluginorder.push(userplugins[userplugin].replace(/^\s+|\s+$/g,""))}}}}if(typeof _model.config.chromeless=="undefined"&&jwplayer.utils.isIOS()){_model.config.chromeless=true}if(_model.config.chromeless){pluginorder=["logo"];if(_model.config.repeat===undefined||_model.config.repeat=="none"){_model.config.repeat="list"}}_model.plugins={order:pluginorder,config:{},object:{}};if(typeof _model.config.components!="undefined"){for(var component in _model.config.components){_model.plugins.config[component]=_model.config.components[component]}}for(var pluginIndex in _model.plugins.order){var pluginName=_model.plugins.order[pluginIndex];var pluginConfig=_model.config[pluginName]===undefined?{}:_model.config[pluginName];_model.plugins.config[pluginName]=_model.plugins.config[pluginName]===undefined?pluginConfig:jwplayer.utils.extend(_model.plugins.config[pluginName],pluginConfig);if(typeof _model.plugins.config[pluginName].position=="undefined"){_model.plugins.config[pluginName].position=jwplayer.html5.view.positions.OVER}else{_model.plugins.config[pluginName].position=_model.plugins.config[pluginName].position.toString().toUpperCase()}}if(typeof _model.plugins.config.dock!="undefined"){if(typeof _model.plugins.config.dock!="object"){var position=_model.plugins.config.dock.toString().toUpperCase();_model.plugins.config.dock={position:position}}if(typeof _model.plugins.config.dock.position!="undefined"){_model.plugins.config.dock.align=_model.plugins.config.dock.position;_model.plugins.config.dock.position=jwplayer.html5.view.positions.OVER}}_model.loadPlaylist=function(arg,ready){var input;if(typeof arg=="string"){try{input=eval(arg)}catch(err){input=arg}}else{input=arg}var config;switch(jwplayer.utils.typeOf(input)){case"object":config=input;break;case"array":config={playlist:input};break;default:config={file:input};break}_model.playlist=new jwplayer.html5.playlist(config);if(_model.config.shuffle){_model.item=_getShuffleItem()}else{if(_model.config.item>=_model.playlist.length){_model.config.item=_model.playlist.length-1}else{if(_model.config.item<0){_model.config.item=0}}_model.item=_model.config.item}if(!ready){_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_PLAYLIST_LOADED,{playlist:_model.playlist})}_model.setActiveMediaProvider(_model.playlist[_model.item])};function _getShuffleItem(){var result=null;if(_model.playlist.length>1){while(result===null){result=Math.floor(Math.random()*_model.playlist.length);if(result==_model.item){result=null}}}else{result=0}return result}function forward(evt){if(evt.type==jwplayer.api.events.JWPLAYER_MEDIA_LOADED){_container=_media.getDisplayElement()}_eventDispatcher.sendEvent(evt.type,evt)}_model.setActiveMediaProvider=function(playlistItem){if(_media!==undefined){_media.resetEventListeners()}_media=new jwplayer.html5.mediavideo(_model,_container);_media.addGlobalListener(forward);if(_model.config.chromeless){_media.load(playlistItem)}return true};_model.getMedia=function(){return _media};_model.seek=function(pos){_eventDispatcher.sendEvent(jwplayer.api.events.JWPLAYER_MEDIA_SEEK,{position:_model.position,offset:pos});return _media.seek(pos)};_model.setupPlugins=function(){for(var plugin in _model.plugins.order){try{var pluginName=_model.plugins.order[plugin];if(jwplayer.html5[pluginName]!==undefined){_model.plugins.object[pluginName]=new jwplayer.html5[pluginName](_api,_model.plugins.config[pluginName])}else{_model.plugins.order.splice(plugin,plugin+1)}}catch(err){jwplayer.utils.log("Could not setup "+pluginName)}}};return _model}})(jwplayer);(function(a){a.html5.playlist=function(b){var d=[];if(b.playlist&&b.playlist instanceof Array&&b.playlist.length>0){for(var c in b.playlist){if(!isNaN(parseInt(c))){d.push(new a.html5.playlistitem(b.playlist[c]))}}}else{d.push(new a.html5.playlistitem(b))}return d}})(jwplayer);(function(b){b.html5.playlistitem=function(d){var e={author:"",date:"",description:"",image:"",link:"",mediaid:"",tags:"",title:"",provider:"",file:"",streamer:"",duration:-1,start:0,currentLevel:-1,levels:[]};var c=b.utils.extend({},e,d);if(c.type){c.provider=c.type;delete c.type}if(c.levels.length===0){c.levels[0]=new b.html5.playlistitemlevel(c)}if(!c.provider){c.provider=a(c.levels[0])}else{c.provider=c.provider.toLowerCase()}return c};function a(e){if(b.utils.isYouTube(e.file)){return"youtube"}else{var f=b.utils.extension(e.file);var c;if(f&&b.utils.extensionmap[f]){c=b.utils.extensionmap[f].html5}else{if(e.type){c=e.type}}if(c){var d=c.split("/")[0];if(d=="audio"){return"sound"}else{if(d=="video"){return d}}}}return""}})(jwplayer);(function(a){a.html5.playlistitemlevel=function(b){var d={file:"",streamer:"",bitrate:0,width:0};for(var c in d){if(b[c]!==undefined){d[c]=b[c]}}return d}})(jwplayer);(function(a){a.html5.skin=function(){var b={};var c=false;this.load=function(d,e){new a.html5.skinloader(d,function(f){c=true;b=f;e()},function(){new a.html5.skinloader("",function(f){c=true;b=f;e()})})};this.getSkinElement=function(d,e){if(c){try{return b[d].elements[e]}catch(f){a.utils.log("No such skin component / element: ",[d,e])}}return null};this.getComponentSettings=function(d){if(c){return b[d].settings}return null};this.getComponentLayout=function(d){if(c){return b[d].layout}return null}}})(jwplayer);(function(a){a.html5.skinloader=function(f,n,i){var m={};var c=n;var j=i;var e=true;var h;var l=f;var q=false;function k(){if(typeof l!="string"||l===""){d(a.html5.defaultSkin().xml)}else{a.utils.ajax(a.utils.getAbsolutePath(l),function(r){try{if(r.responseXML!==null){d(r.responseXML);return}}catch(s){}d(a.html5.defaultSkin().xml)},function(r){d(a.html5.defaultSkin().xml)})}}function d(w){var C=w.getElementsByTagName("component");if(C.length===0){return}for(var F=0;F<C.length;F++){var A=C[F].getAttribute("name");var z={settings:{},elements:{},layout:{}};m[A]=z;var E=C[F].getElementsByTagName("elements")[0].getElementsByTagName("element");for(var D=0;D<E.length;D++){b(E[D],A)}var x=C[F].getElementsByTagName("settings")[0];if(x!==undefined&&x.childNodes.length>0){var I=x.getElementsByTagName("setting");for(var N=0;N<I.length;N++){var O=I[N].getAttribute("name");var G=I[N].getAttribute("value");var v=/color$/.test(O)?"color":null;m[A].settings[O]=a.utils.typechecker(G,v)}}var J=C[F].getElementsByTagName("layout")[0];if(J!==undefined&&J.childNodes.length>0){var K=J.getElementsByTagName("group");for(var u=0;u<K.length;u++){var y=K[u];m[A].layout[y.getAttribute("position")]={elements:[]};for(var M=0;M<y.attributes.length;M++){var B=y.attributes[M];m[A].layout[y.getAttribute("position")][B.name]=B.value}var L=y.getElementsByTagName("*");for(var t=0;t<L.length;t++){var r=L[t];m[A].layout[y.getAttribute("position")].elements.push({type:r.tagName});for(var s=0;s<r.attributes.length;s++){var H=r.attributes[s];m[A].layout[y.getAttribute("position")].elements[t][H.name]=H.value}if(m[A].layout[y.getAttribute("position")].elements[t].name===undefined){m[A].layout[y.getAttribute("position")].elements[t].name=r.tagName}}}}e=false;p()}}function p(){clearInterval(h);if(!q){h=setInterval(function(){o()},100)}}function b(w,v){var u=new Image();var r=w.getAttribute("name");var t=w.getAttribute("src");var y;if(t.indexOf("data:image/png;base64,")===0){y=t}else{var s=a.utils.getAbsolutePath(l);var x=s.substr(0,s.lastIndexOf("/"));y=[x,v,t].join("/")}m[v].elements[r]={height:0,width:0,src:"",ready:false};u.onload=function(z){g(u,r,v)};u.onerror=function(z){q=true;p();j()};u.src=y}function o(){for(var r in m){if(r!="properties"){for(var s in m[r].elements){if(!m[r].elements[s].ready){return}}}}if(e===false){clearInterval(h);c(m)}}function g(r,t,s){m[s].elements[t].height=r.height;m[s].elements[t].width=r.width;m[s].elements[t].src=r.src;m[s].elements[t].ready=true;p()}k()}})(jwplayer);(function(a){a.html5.api=function(b,l){var k={};var f=document.createElement("div");b.parentNode.replaceChild(f,b);f.id=b.id;k.version=a.version;k.id=f.id;var j=new a.html5.model(k,f,l);var h=new a.html5.view(k,f,j);var i=new a.html5.controller(k,f,j,h);k.skin=new a.html5.skin();k.jwPlay=function(m){if(typeof m=="undefined"){e()}else{if(m.toString().toLowerCase()=="true"){i.play()}else{i.pause()}}};k.jwPause=function(m){if(typeof m=="undefined"){e()}else{if(m.toString().toLowerCase()=="true"){i.pause()}else{i.play()}}};function e(){if(j.state==a.api.events.state.PLAYING||j.state==a.api.events.state.BUFFERING){i.pause()}else{i.play()}}k.jwStop=i.stop;k.jwSeek=i.seek;k.jwPlaylistItem=i.item;k.jwPlaylistNext=i.next;k.jwPlaylistPrev=i.prev;k.jwResize=i.resize;k.jwLoad=i.load;function g(m){return function(){return j[m]}}function d(m,o,n){return function(){var p=j.plugins.object[m];if(p&&p[o]&&typeof p[o]=="function"){p[o].apply(p,n)}}}k.jwGetItem=g("item");k.jwGetPosition=g("position");k.jwGetDuration=g("duration");k.jwGetBuffer=g("buffer");k.jwGetWidth=g("width");k.jwGetHeight=g("height");k.jwGetFullscreen=g("fullscreen");k.jwSetFullscreen=i.setFullscreen;k.jwGetVolume=g("volume");k.jwSetVolume=i.setVolume;k.jwGetMute=g("mute");k.jwSetMute=i.setMute;k.jwGetStretching=g("stretching");k.jwGetState=g("state");k.jwGetVersion=function(){return k.version};k.jwGetPlaylist=function(){return j.playlist};k.jwGetPlaylistIndex=k.jwGetItem;k.jwAddEventListener=i.addEventListener;k.jwRemoveEventListener=i.removeEventListener;k.jwSendEvent=i.sendEvent;k.jwDockSetButton=function(p,m,n,o){if(j.plugins.object.dock&&j.plugins.object.dock.setButton){j.plugins.object.dock.setButton(p,m,n,o)}};k.jwShowControlbar=d("controlbar","show");k.jwHideControlbar=d("controlbar","hide");k.jwShowDock=d("dock","show");k.jwHideDock=d("dock","hide");k.jwShowDisplay=d("display","show");k.jwHideDisplay=d("display","hide");k.jwGetLevel=function(){};k.jwGetBandwidth=function(){};k.jwGetLockState=function(){};k.jwLock=function(){};k.jwUnlock=function(){};function c(o,n,m){return function(){o.loadPlaylist(o.config,true);o.setupPlugins();n.setup(o.getMedia().getDisplayElement());var p={id:k.id,version:k.version};m.sendEvent(a.api.events.JWPLAYER_READY,p);if(playerReady!==undefined){playerReady(p)}if(window[o.config.playerReady]!==undefined){window[o.config.playerReady](p)}o.sendEvent(a.api.events.JWPLAYER_PLAYLIST_LOADED,{playlist:o.playlist});m.item(o.item)}}if(j.config.chromeless){setTimeout(c(j,h,i),25)}else{k.skin.load(j.config.skin,c(j,h,i))}return k}})(jwplayer)};
function Title(rawTitle) {
	function analyze(rawTitle) {
		var minIdx = 100000;
		var i = -1;

		i = rawTitle.indexOf(":");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		i = rawTitle.indexOf("(");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		i = rawTitle.indexOf("[");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		i = rawTitle.indexOf("-");
		if (i > 0 && i < minIdx) {
			minIdx = i;
		}

		if (minIdx < 100000) {
			return rawTitle.substring(0, minIdx);
		}
		else {
			return rawTitle;
		}
	}

	this.name = analyze(rawTitle);
}

Title.prototype.getName = function() {
	return this.name;
};
function Image() {
	
}

 // Load image offscreen and replace placeholder
Image.prototype.load = function (node) {
	var images = node.find('img');
	
    var errorReset = function() {
        $(this).error(function() {});
        $(this).attr("src", placeholder);
    };

	for (var i = 0; i < images.length; i++) {
		var image = $(images[i]);
        var placeholder = image.attr('src');
		var src = image.attr('data-src');
		if (src != null) {
            image.error(errorReset);
			image.attr("src", src);
		}
	}
};
function Channels() {
	this.channels = ["dr1", "dr2", "ramasjang", "drk", "drupdate", "drhd"];
}

Channels.prototype.getCleanName = function (idx) {
	return this.channels[idx];
};

function formatTimeComponent(i) {
	if (i < 10) {
        i = "0" + i;
    }
    return i;
}

Date.prototype.getFormattedTime = function () {
    return formatTimeComponent(this.getHours()) + ':' + formatTimeComponent(this.getMinutes());
};

Date.prototype.getFormattedHour = function () {
	return formatTimeComponent(this.getHours()) + ':00';
};

Date.parseJsonDate = function (jsonDate) {
    var offset = new Date().getTimezoneOffset() * 60000,
        parts  = /\/Date\((-?\d+)([+\-]\d{2})?(\d{2})?.*/.exec(jsonDate);

    if (parts[2] === undefined) {
        parts[2] = 0;
    }
    
    if (parts[3] === undefined) {
        parts[3] = 0;
    }
    
    return new Date(+parts[1] + offset + parts[2] * 3600000 + parts[3] * 60000);
};

/**
 * Return a Javascript Date for the given XML Schema date string.  Return
 * null if the date cannot be parsed.
 *
 * Does not know how to parse BC dates or AD dates < 100.
 *
 * Valid examples of input:
 * 2010-04-28T10:46:37.0123456789Z
 * 2010-04-28T10:46:37.37Z
 * 2010-04-28T10:46:37Z
 * 2010-04-28T10:46:37
 * 2010-04-28T10:46:37.012345+05:30
 * 2010-04-28T10:46:37.37-05:30
 * 1776-04-28T10:46:37+05:30
 * 0150-04-28T10:46:37-05:30
 *
 * Ref: http://stackoverflow.com/questions/2731579/convert-an-xml-schema-date-string-to-a-javascript-date
 */
Date.parseXmlDate = function(xmlDate) {
	// It's times like these you wish Javascript supported multiline regex specs
	var re = /^([0-9]{4,})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(\.[0-9]+)?(Z|([+\-])([0-9]{2}):([0-9]{2}))?$/,
        match = xmlDate.match(re);
    
	if (!match) {
		return null;
	}
	
	var all = match[0];
	var year = match[1];  var month = match[2];  var day = match[3];
	var hour = match[4];  var minute = match[5]; var second = match[6];
	var milli = match[7]; 
	var z_or_offset = match[8];  var offset_sign = match[9]; 
	var offset_hour = match[10]; var offset_minute = match[11];
	
	// The DR timestamp is totally screwed up in regards to timezone so we ignore
	// the timezone offset (which _is_ specified) and just use the time as-is. 
	/*
	if (offset_sign) { // ended with +xx:xx or -xx:xx as opposed to Z or nothing
		var direction = (offset_sign == "+" ? 1 : -1);
		hour   = parseInt(hour)   + parseInt(offset_hour)   * direction;
		minute = parseInt(minute) + parseInt(offset_minute) * direction;
	}
	var utcDate = Date.UTC(year, month, day, hour, minute, second, (milli || 0));
	return new Date(utcDate);
	*/
	return new Date(year, month, day, hour, minute, second, (milli || 0));
};
function Watcher() {
}

Watcher.prototype.loadWatcherCount = function(elementId, channelIdx) {
	$.get('api/watchers.php?channel='+channelIdx+'&ts='+new Date().getTime(), function(data) {
		$(elementId).find('#'+data.channel).find('.watchers').html(data.count);
	});
};

Watcher.prototype.watching = function(channelIdx) {
	$.get('api/watchers.php?channel='+channelIdx+'&update=t&ts='+new Date().getTime(), function(data) {
	});
};
/**
 * EPG service.
 *
 * @author Jakob Hilarius, http://syscall.dk
 */
function Epg(watcher) {
    // Register last epg load time to minimize EPG calls
    this.EPG_UPDATE_INTERVAL_IN_MILLIS = 30000; 
    
    this.lastEpgUpdate = 0;
    
    this.channels = new Channels();
    this.watcher = watcher;
}

/**
 * Loads the EPG into the element specified by elementId.
 *
 * @param elementId The id of the element where to load the EPG.
 * @param currentChannelIdx The current selected channel.
 */
Epg.prototype.loadGuide = function(elementId, currentChannelIdx) {
	var now = new Date().getTime();

	if (now - this.EPG_UPDATE_INTERVAL_IN_MILLIS < this.lastEpgUpdate) {
		return;
	}

	// Register scope for the callback function
    var scope = this;
    
	$.getJSON('http://www.dr.dk/nu/api/nownext?ts='+now+'&callback=?', function(data) {
		$(elementId).empty();
		
		var start = new Date();
		var end   = new Date(start.getTime() + 3600000);

		$(elementId).append('<div id="title">'+start.getFormattedHour()+' - ' + end.getFormattedHour() + '</div>');
		
		var channels = data.channels;
		for (var i = 0; i < channels.length; i++) {
			var channel = channels[i];

			var channelTitle = '<img src="images/'+scope.channels.getCleanName(i)+'.png" alt="'+channel.channel+'" />';

			var title =  "Ingen udsendelse pt"; 
			if (channel.current != null && channel.current.programTitle != null) {
				title = channel.current.programTitle;
			}
			var nextTitle = "";
			if (channel.next != null && channel.next.programTitle != null) {
				var timeToNextProgramStart = (channel.next.startTS - channel.next.currentServerTimeTS)/1000/60; 
				nextTitle = '<span class="next_title">' + channel.next.programTitle + '</span> starter om ' + Math.round(timeToNextProgramStart) + ' min.';
			}
			var active = (i === currentChannelIdx) ? "active" : "";

			$(elementId).append('<div id="'+i+'" class="item '+active+'"><div class="channel">'+channelTitle+'</div><div class="description"><div class="now">'+title+'</div><div class="next">'+nextTitle+'</div></div><div class="watchers">0</div></div>');
		}

		scope.lastEpgUpdate = new Date().getTime();
		
		// TODO: Remove?
		scope.watcher.loadWatcherCount(elementId, currentChannelIdx);
	}).error(function() {
		$(elementId).empty();
		$(elementId).append('<div id="error">Problem med TV guiden!</div>');
	});
};

Epg.prototype.loadChannelInfo = function (elementId, activeIdx) {
	var channelId = this.channels.getCleanName(activeIdx);

	var ts = new Date().getTime();
    $.getJSON('http://www.dr.dk/nu/api/nownext?ts=' + ts + "&callback=?", function (data) {
        var idx = activeIdx;

        var channel = data.channels[idx];
        
        var title = "Ingen udsendelse pt"; 
        var description = "";
        var start = "";
        var end = "";
        
        if (channel != null) {
            if (channel.current != null) {
                if (channel.current.programTitle != null) {
                    title = channel.current.programTitle;
                }

                if (channel.current.description != null) {
                    description = channel.current.description;
                }

                start = Date.parseXmlDate(channel.current.start);
                end   = Date.parseXmlDate(channel.current.end);
            }
            else if (channel.next != null) {
                // current program is sometime undefined in a transitioning state
                // so we use the next program in that case
                if (channel.next.programTitle != null) {
                    title = channel.next.programTitle;
                }

                if (channel.next.description != null) {
                    description = channel.next.description;
                }

                start = Date.parseXmlDate(channel.next.start);
                end   = Date.parseXmlDate(channel.next.end);
            }
        }

		var timeFrame = start.getFormattedTime()+' - '+ end.getFormattedTime();

		var iconDiv  = '<div class="channel"><img src="images/'+channelId+'.gif" alt="'+title+'" /></div>';
		var timeDiv  = '<div class="time">' + timeFrame + '</div>';
		var titleDiv = '<div class="title">'+title+'</div>';
		var descDiv  = '<div class="summary">'+description+'</div>';
		var iconsDiv = '<div class="icons"></div>';
        
		$(elementId).empty();
		$(elementId).append(iconDiv+timeDiv+titleDiv+descDiv+iconsDiv);

    }).error(function () { console.log('ERROR'); });
};

Epg.prototype.getActiveShow = function(currentChannelIdx, callback) {
	var now = new Date().getTime();
    
    $.getJSON('http://www.dr.dk/nu/api/nownext?ts='+now+'&callback=?', function(data) {
        var channel =  data.channels[currentChannelIdx];

		var rawTitle = "Ingen udsendelse";
        if (channel != null) {
			if (channel.current != null) {
				rawTitle = channel.current.programTitle;
			}
			else if (channel.next != null) {
				rawTitle = channel.next.programTitle;
			}
			
		}
		var title = new Title(rawTitle).getName();

        callback(title);
    });
};
/**
 * Player.
 *
 * @author Jakob Hilarius, http://syscall.dk
 */
function Player() {
    
    this.activeItem = {
        'type': 'channel',
        'idx': 0,
        'channel': 'dr1'
    };
    this.state = {};
}

Player.prototype.play = function(item) {
    if (item.videoId !== undefined) {
        var scope = this;
        $.get('api/video.php?id=' + item.videoId, function (data) {
            var s = data.url.indexOf("mp4:");
            
            var streamer = data.url.substring(0, s - 1);
            var file = data.url.substring(s);

            var currentVodStartTime = new Date();
            var currentVodEndTime = new Date(currentVodStartTime);
                
            var durationComponents = data.duration.split(':');
            currentVodEndTime.setHours(currentVodStartTime.getHours() + parseInt(durationComponents[0], 10));
            currentVodEndTime.setMinutes(currentVodStartTime.getMinutes() + parseInt(durationComponents[1], 10));
            currentVodEndTime.setSeconds(currentVodStartTime.getSeconds() + parseInt(durationComponents[2], 10)); 
        
            // Register title as search term which allows "search for active show"
            scope.state.lastSearchTerm = new Title(data.title).getName();
        
            scope.activeItem = {
                'type': 'video',
                'file': file,
                'streamer': streamer,
                'title': data.title,
                'description': data.description,
                'startTime': currentVodStartTime,
                'endTime': currentVodEndTime,
                'icon': ''
            };

            // We are no longer viewing any channel
            scope.state.currentChannelIdx = -1;

            jwplayer().load({ file: scope.activeItem.file, streamer: scope.activeItem.streamer, provider:"rtmp" });
        }).error(function () { console.log('ERROR'); });

	}
	else if (item.channel !== undefined) {

        var channel = item.channel;

        this.activeItem.channel = channel;
        this.activeItem.idx = item.idx;
        this.activeItem.type = 'channel';

        jwplayer().load("playlists/" + channel + ".xml");
	}
};

Player.prototype.next = function() {
	jwplayer().playlistNext();
};

Player.prototype.previous = function() {
	jwplayer().playlistPrev();
};

Player.prototype.getItem = function(callback) {
    if (this.activeItem.type === 'channel') {
        var scope = this;

        // Shows on a channel change over time so we need to reload info
        // on request.
        var ts = new Date().getTime();
        $.getJSON('http://www.dr.dk/nu/api/nownext?ts=' + ts + "&callback=?", function (data) {
            var channelId = scope.activeItem.channel;
            var idx = scope.activeItem.idx;

            var channel = data.channels[idx];
            
            var title = "Ingen udsendelse pt"; 
            var description = "";
            var start = "";
            var end = "";
            
            if (channel != null) {
                if (channel.current != null) {
                    if (channel.current.programTitle != null) {
                        title = channel.current.programTitle;
                    }

                    if (channel.current.description != null) {
                        description = channel.current.description;
                    }

                    start = Date.parseXmlDate(channel.current.start);
                    end   = Date.parseXmlDate(channel.current.end);
                }
                else if (channel.next != null) {
                    // current program is sometime undefined in a transitioning state
                    // so we use the next program in that case
                    if (channel.next.programTitle != null) {
                        title = channel.next.programTitle;
                    }

                    if (channel.next.description != null) {
                        description = channel.next.description;
                    }

                    start = Date.parseXmlDate(channel.next.start);
                    end   = Date.parseXmlDate(channel.next.end);
                }
            }
            
            scope.activeItem = {
                'type': 'channel',
                'title': title,
                'description': description,
                'startTime': start,
                'endTime': end,
                'icon': 'images/' + channelId + '.gif'
            };


            callback(scope.activeItem);
        }).error(function () { console.log('ERROR'); });
    }
    else {
        // Meta data was loaded on the play request so we return the data immediately.
        callback(this.activeItem);
    }
};

Player.prototype.getState = function(callback) {
    callback(this.state);
};

// Setup globals for all AJAX requests
$.ajaxSetup({ timeout: 5000 });
    
var playlists = ["dr1","dr2","ramasjang","drk","drupdate","drhd"];
    
var dialog = {
  showQuitDialog: function() {
	boxeeAPI.promptDialog("Afslut?", "Er du sikker på, at du vil afslutte DR Live TV?", function(confirmed) {
		if (confirmed) {
			boxeeAPI.closeApp();
		}
	});
  }
};    

if (!window.console) {
    console = {};
}

$(function () {
    boxeeAPI.keyboardMode();

	// The channel we are currently viewing
    // TODO: Move to Player
    var currentChannelIdx = 0;
    // The channel selected in the EPG
    var activeIdx = currentChannelIdx;

    // Index for navigating videos
    var currentVideoBeginIdx = 0;

    var lastSearchTerm = "";

    var WATCHING_INTERVAL_IN_MILLIS = 30000;

	var watcher = new Watcher();
	var epg = new Epg(watcher);
    var player = new Player();

    function setupPlayer() {
        boxee.onKeyboardKeyLeft  = function() {browser.keyPress(browser.KEY_LEFT);};
        boxee.onKeyboardKeyRight = function() {browser.keyPress(browser.KEY_RIGHT);};
        boxee.onKeyboardKeyUp    = function() {browser.keyPress(browser.KEY_UP);};
        boxee.onKeyboardKeyDown  = function() {browser.keyPress(browser.KEY_DOWN);};
        boxee.onKeyboardKeyEnter = function() {browser.keyPress(browser.KEY_RETURN);};
        boxee.onKeyboardKeyBack  = function() {browser.keyPress(browser.KEY_ESCAPE);};
    }

    // Register in Control Context (see http://developer.boxee.tv/Control_Script_Context)
    boxee.exec(setupPlayer);
    // Execute in Control Context (see http://developer.boxee.tv/Control_Script_Context)
    boxee.exec("setupPlayer()");

    function watchingPing() {
        watcher.watching(currentChannelIdx);
    }

    function searchForActiveShow() {
        if (currentChannelIdx < 0) {
            search(lastSearchTerm);
            return;
        }
        epg.getActiveShow(currentChannelIdx, search);
    }

	function searchFreetext() {
		var selectedElement = $('#search .search_elem.selected');
	
		var term = selectedElement.val();
		if (selectedElement.is("div")) {
			term = selectedElement.html();
		}
	
		if ($.trim(term) === "") {
			return;
		}
		
		var prevSearches = $.cookie("boxee_dr_live_tv_prev_search");
		if (prevSearches === null || prevSearches === "") {
			prevSearches = [];
		}
		else {
			prevSearches = prevSearches.split(",");
		}
		var newLength = prevSearches.unshift(term);
		while (newLength > 4) {
			prevSearches.pop();
			newLength = prevSearches.length;
		}
		
		$.cookie("boxee_dr_live_tv_prev_search", prevSearches, { expires: 365 });

        hideSearch();
		search(term);
	}

    function search(term) {
        //$.get('api/search.php?term=' + encodeURIComponent(term), function(data) {
        var encodedSearchTerm = encodeURIComponent(term).replace(/\+/g, '%20');
        $.getJSON('http://www.dr.dk/nu/api/search/' + encodedSearchTerm + "?callback=?", function(data) {
            lastSearchTerm = term;
            
            buildVideos(data);
        });
    }

    function loadActiveVideos(path) {
        var api = "";

        if (path === undefined) {
			var selectedVideo = $('#videos_menu').find('.selected');
			var cmdElement = selectedVideo.children('.cmd');
			if (cmdElement === null || cmdElement.length === 0) {
				return;
			}
		
			var cmd = cmdElement.html();
			
			api = 'api/'+cmd+'.php?ts='+new Date().getTime();
		}
		else {
			api = 'api/' + path + '?ts='+new Date().getTime();
		}
    
        $.get(api, function(data) {            
            buildVideos(data);
        });
    }

	function buildVideos(data) {
        currentVideoBeginIdx = 0;

        $('#video_menu_inactive').remove();
		$('#videos').remove();
        $('#videos_spacer').remove();

        var videos = $('<div id="videos" />');

        if (data.length === 0) {
            videos.append('<div class="error">Ingen videoer fundet</div>');
        }
			
        for (var i = 0; i < data.length; i++) {
            var r = data[i];
            
            var video = $('<div class="video" />');
            if (i === 0) {
                video.addClass("selected");
            }
            
            var title = r.title;
            var slug = null;
            
            var thumb = null;
            
            if (r.id === undefined) {
                thumb = $('<div class="thumb"><img src="images/default_video.png" data-src="api/imageproxy.php/programseries/'+r.slug+'/images/200x150.jpg" alt="" /></div>');

                slug = r.slug;
            }
            else {
                thumb = $('<div class="thumb"><img src="images/default_video.png" data-src="api/imageproxy.php/videos/'+r.id+'/images/200x150.jpg" alt="" /></div>');

                slug = r.programSerieSlug;
			}
			var favMark = $('<div class="favorite"><img src="images/buttons/graphic-check-54px.png" alt="" /></div>');
			
			if (!isFavorite(title, slug)) {
				favMark.hide();
			}
			video.append(favMark);
			video.append(thumb);
			video.append('<div class="title">'+r.title+'</div>');
			if (r.id !== undefined) {
				video.append('<div style="display:none;" class="video_id">'+r.id+'</div>');
			}
			video.append('<div style="display:none;" class="video_slug">'+slug+'</div>');
            //video.append('<div style="display:none;" class="description">' + r.description + '</div>');

			if (i > 4) {
                video.hide();
            }
            else {
                // Load visible thumbs
                new Image().load(thumb);
            }

            videos.append(video);
        }

		$('body').append('<div id="video_menu_inactive">Press Up for Menu</div>');
        $('body').append(videos);
        $('body').append('<div id="videos_spacer" />');
        
        showVideos();
	}

    function updateClock() {
        var now = new Date();

        $('#clock').remove();
        
        $('body').append('<div id="clock"></div>');
        
        $('#clock').append('<span class="icon clock"></span>');
        $('#clock').append(now.getFormattedTime());
    }

	function showSearch() {

		$('body').append('<div id="search"><input name="search_field" id="search_field" class="search_elem selected" /></div>');

		$('#search_field').focus();

		$('#search').append('<hr/>');
		
		var prevSearchQueries = $.cookie("boxee_dr_live_tv_prev_search");
		if (prevSearchQueries != null) {
			prevSearchQueries = prevSearchQueries.split(",");
			for(var i = 0; i < prevSearchQueries.length && i < 4; i++) {
				$('#search').append('<div class="search_elem prev_search">'+prevSearchQueries[i]+'</div>');
			}
		}
	}
	function hideSearch() {
		$('#search').remove();
	}

    function showVideos() {
        $('#video_menu_inactive').show();
    }
    function hideVideos() {
        hideVideosMenu(true);
        $('#video_menu_inactive').hide();
        $('#videos_spacer').hide();
        $('#videos').hide();
        currentVideoBeginIdx = 0;
    }

	function showVideosMenu() {
        $('#video_menu_inactive').hide();
        // Remove the selected element in the video selection menu, since we are selection content in another menu
		$('#videos').find('.video').removeClass('selected');
	
		if ($('#videos_menu').length === 0) {
			var menu = $('<div id="videos_menu"></div>');
			
			//menu.append('<div class="menu selected"><img src="images/buttons/icon_whatsnew.png" alt="Nyeste" /><span>Nyeste</span><div style="display:none;" class="cmd">newest</div></div>');
			menu.append('<div class="menu selected"><span class="icon new"></span><span class="title">Nyeste</span><div style="display:none;" class="cmd">newest</div></div>');
			menu.append('<div class="menu"><span class="icon popular"></span><span class="title">Mest Populære</span><div style="display:none;" class="cmd">mostviewed</div></div>');
			menu.append('<div class="menu"><span class="icon favorite"></span><span class="title">Favoritter</span><div style="display:none;" class="cmd">favorites</div></div>');
			menu.append('<div class="menu"><span class="icon all"></span><span class="title">Alle Programmer</span><div style="display:none;" class="cmd">programs</div></div>');
		
			$('body').append(menu);
		}
		else {
			$('#videos_menu').show();
		}
	}
	function hideVideosMenu(reset) {
		reset = typeof reset !== 'undefined' ? reset : false;

		if (reset) {
			$('#videos_menu').remove();
		}
		else {
			// When we only hide the element the selected menu is remembered
			$('#videos_menu').hide();
		}
		
		$('#video_menu_inactive').show();
	}

    function showGuide() {
        setActiveMenuElement(currentChannelIdx);

        hideInfo();

        epg.loadGuide('#menu', currentChannelIdx);

        $('#menu_spacer').show(); 
        $('#menu').show();
    }
    function hideGuide() {
        $('#menu_spacer').hide();
        $('#menu').hide();
    }

    function showInfo() {
        hideGuide();
        
        epg.loadChannelInfo('#description', activeIdx);
        
        $('#description').show();
    }
    function hideInfo() {
        $('#description').hide();
    }

    function showClock() {
        updateClock();

        $('#clock').show();
    }
    function hideClock() {
        $('#clock').hide();
    }

    function changeChannel() {
        // Only change channel if it has actually changed
        if (currentChannelIdx === activeIdx) {
            return;
        }

        if (watchingTimer != null) {
            clearInterval(watchingTimer);
        }


        var activeElement = $('.active')[0];
        var idx = activeElement.id;
        

        currentChannelIdx = idx;

        setInterval(watchingPing, WATCHING_INTERVAL_IN_MILLIS);
        
        var channel = playlists[idx];
        
        player.play({
            'channel': channel, 
            'idx': idx
        });
    }
    function playVideo() {
        var selectedVideo = $('#videos').find('.selected');
        var videoIdElement = selectedVideo.children('.video_id');
        if (videoIdElement.length === 0) {
            var videoSlugElement = selectedVideo.children('.video_slug');
            var videoSlug = videoSlugElement.html();

            loadActiveVideos("programs.php/"+videoSlug+"/videos");
            return false;
        }
        
        var videoId = videoIdElement.html();
        
        player.play({videoId: videoId });
        return true;
    }
    
	function toggleFavorite() {
		var selectedVideo = $('#videos').find('.selected');
		var videoSlugElement = selectedVideo.children('.video_slug');
		
        if (videoSlugElement.length === 0) {
            return;
        }
        
        var title = selectedVideo.children('.title').html();
        var videoSlug = videoSlugElement.html();
        
        
        if (isFavorite(title,videoSlug)) {
            removeFavorite(title, videoSlug);
            selectedVideo.find('.favorite').hide();
        }
        else {
            addFavorite(title, videoSlug);
            selectedVideo.find('.favorite').show();
        }
	}
	function isFavorite(title,slug) {
		return $.inArray(title+':::'+slug, getFavorites()) > -1;
	}
	function getFavorites() {
		var favorites = $.cookie("boxee_dr_live_tv_favorites");
		if (favorites !== null) {
			return favorites.split(",");
		}
		return [];
	}
	function addFavorite(title, slug) {
		var favorites = getFavorites();
		
		favorites.push(title+':::'+slug);
		
		$.cookie("boxee_dr_live_tv_favorites", favorites, { expires: 1500 });

	}
	function removeFavorite(title, slug) {
		var favorites = getFavorites();
		
		var idx = favorites.indexOf(title+':::'+slug);
		if (idx < 0) {
			return;
		}
		
		favorites.splice(idx, 1);
		
		$.cookie("boxee_dr_live_tv_favorites", favorites, { expires: 1500 });
	}

    function moveSelection(direction) {
        var active_elem = document.getElementsByClassName("active")[0];
        var active_id = -1;
        if (active_elem !== null) {
            active_id = active_elem.id;
        }
        if ((active_id === 0 && direction < 0) || (active_id === playlists.length-1 && direction > 0)) {return;}
		var next_id = parseInt(active_id, 10) + parseInt(direction, 10);

        setActiveMenuElement(next_id);
    }

    function moveVideoSelection(direction) {
        var videos = $('#videos').children();
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }

                // Check if we move out of the view block to the right
                if (i >= currentVideoBeginIdx + 4 && direction > 0) {
                    $(videos[currentVideoBeginIdx]).hide();
                    $(videos[i+1]).show();
                    new Image().load($(videos[i+1]));
                    currentVideoBeginIdx++;
                }
                // Check if we move out of the view block to the left
                if (i <= currentVideoBeginIdx && direction < 0) {
                    $(videos[i-1]).show();
                    $(videos[currentVideoBeginIdx+4]).hide();
                    currentVideoBeginIdx--;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[i+direction]).addClass('selected');
                break;
            }
        }
        // Select the first element if none are selected
        if ($('#videos').find('.selected').length === 0 && videos.length > 0) {
            $(videos[0]).addClass('selected');
        }
    }

	function moveVideoMenuSelection(direction) {
        var videos = $('#videos_menu').children();
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[i+direction]).addClass('selected');
                break;
            }
        }
    }

	function moveSearchSelection(direction) {
        var videos = $('#search .search_elem');
        for (var i = 0; i < videos.length; i++) {
            var video = $(videos[i]);
            
            if (video.hasClass('selected')) {
                if (i === 0 && direction < 0) {
                    return;
                }
                if (i+direction >= videos.length) {
                    return;
                }

                // Check if we move out of the view block to the right
                if (i >= currentVideoBeginIdx + 4 && direction > 0) {
                    $(videos[currentVideoBeginIdx]).hide();
                    $(videos[i+1]).show();
                    currentVideoBeginIdx++;
                }
                // Check if we move out of the view block to the left
                if (i <= currentVideoBeginIdx && direction < 0) {
                    $(videos[i-1]).show();
                    $(videos[currentVideoBeginIdx+4]).hide();
                    currentVideoBeginIdx--;
                }

                // Set the new selected element
                video.removeClass('selected');
                $(videos[i+direction]).addClass('selected');
                break;
            }
        }
    }

    function setActiveMenuElement(idx) {
        var active = $('#menu').find('.active');
        active.removeClass('active');

        $('#'+idx).addClass('active');

        activeIdx = idx;

        watcher.loadWatcherCount('#menu', activeIdx);
    }

    function onEnter() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#videos_menu').is(":visible")) {
            loadActiveVideos();
            hideVideosMenu();
        }
        else if ($('#videos').is(":visible")) {
            var playing = playVideo();
            if (playing) {
                hideVideos();
            }
        }
        else if ($('#menu').is(":visible")) {
            changeChannel();

            hideGuide();
            hideClock();
        }
        else if ($('#search').is(":visible")) {
			searchFreetext();
        }
        else {
            showGuide();
            showClock();
        }
    }

    function onBack() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#menu').is(":visible")) {
            hideGuide();
            hideClock();
        }
        else if ($('#videos').is(":visible")) {
            hideVideos();
        }
        else if ($('#search').is(":visible")) {
            hideSearch();
        }
        else {
            dialog.showQuitDialog();
        }
        
    }

    function onRight() {
        if ($('#description').is(':visible')) {
        }
        else if ($('#videos_menu').is(":visible")) {
            moveVideoMenuSelection(1);
        }
        else if ($('#videos').is(":visible")) {
            moveVideoSelection(1);
        }
        else if ($('#menu').is(":visible")) {
            showInfo();
            showClock();
        }
        else if ($('#search').is(":visible")) {}
        else {
            player.next();
        }
    }
   
    function onLeft() {
        if ($('#description').is(':visible')) {
            showGuide();
            showClock();
        }
        else if ($('#videos_menu').is(":visible")) {
            moveVideoMenuSelection(-1);
        }
        else if ($('#videos').is(":visible")) {
            moveVideoSelection(-1);
        }
        else if ($('#menu').is(":visible")) {

        }
        else if ($('#search').is(":visible")) {}
        else {
            player.previous();
        }
    }

    function onUp() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
        else if ($('#videos').is(":visible")) {
            showVideosMenu();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(-1);
        }
        else if ($('#search').is(":visible")) {
            moveSearchSelection(-1);
        }
        else {
            setActiveMenuElement(currentChannelIdx);
            
            showInfo();
            showClock();
        }
    }

    function onDown() {
        if ($('#description').is(":visible")) {
            hideInfo();
            hideClock();
        }
		else if ($('#videos_menu').is(":visible")) {
            hideVideosMenu();
        }
        else if ($('#videos').is(":visible")) {
            toggleFavorite();
        }
        else if ($('#menu').is(":visible")) {
            moveSelection(1);
        }
        else if ($('#search').is(":visible")) {
            moveSearchSelection(1);
        }
        else {
            searchForActiveShow();
        }
    }

    // Browser control
    $(document).keydown(function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);

        switch(code) {
        case 13:
            onEnter();
            break;
        case 27:
            onBack();
            break;
        case 37:
            onLeft();
            break;
        case 38:
            onUp();
            break;
        case 39:
            onRight();
            break;
        case 40:
            onDown();
            break;
        default:
            break;
        }
    });

    /* *********************************************
     * INIT
     * ********************************************* */
    showGuide();
    showClock();
    
    // TODO: Move to Player
    watchingPing(); // Start the watching timer right away
    var watchingTimer = setInterval(watchingPing, WATCHING_INTERVAL_IN_MILLIS);
});
