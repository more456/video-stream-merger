(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VideoStreamMerger = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";module.exports=VideoStreamMerger;function VideoStreamMerger(a){var b=this;if(!(b instanceof VideoStreamMerger))return new VideoStreamMerger(a);a=a||{};var c=window.AudioContext||window.webkitAudioContext,d=!!(c&&(b._audioCtx=a.audioContext||new c).createMediaStreamDestination),e=!!document.createElement("canvas").captureStream;if(!(d&&e))throw new Error("Unsupported browser");b.width=a.width||400,b.height=a.height||300,b.fps=a.fps||25,b.clearRect=!(a.clearRect!==void 0)||a.clearRect,b._canvas=document.createElement("canvas"),b._canvas.setAttribute("width",b.width),b._canvas.setAttribute("height",b.height),b._canvas.setAttribute("style","position:fixed; left: 110%; pointer-events: none"),b._ctx=b._canvas.getContext("2d"),b._streams=[],b._audioDestination=b._audioCtx.createMediaStreamDestination(),b._setupConstantNode(),b.started=!1,b.result=null,b._backgroundAudioHack()}VideoStreamMerger.prototype.getAudioContext=function(){var a=this;return a._audioCtx},VideoStreamMerger.prototype.getAudioDestination=function(){var a=this;return a._audioDestination},VideoStreamMerger.prototype.getCanvasContext=function(){var a=this;return a._ctx},VideoStreamMerger.prototype._backgroundAudioHack=function(){var a=this,b=a._audioCtx.createConstantSource(),c=a._audioCtx.createGain();c.gain.value=.001,b.connect(c),c.connect(a._audioCtx.destination),b.start()},VideoStreamMerger.prototype._setupConstantNode=function(){var a=this,b=a._audioCtx.createConstantSource();b.start();var c=a._audioCtx.createGain();c.gain.value=0,b.connect(c),c.connect(a._audioDestination)},VideoStreamMerger.prototype.updateIndex=function(a,b){var c=this;"string"==typeof a&&(a={id:a}),b=null==b?0:b;for(var d=0;d<c._streams.length;d++)a.id===c._streams[d].id&&(c._streams[d].index=b);c._sortStreams()},VideoStreamMerger.prototype._sortStreams=function(){var a=this;a._streams=a._streams.sort(function(c,a){return c.index-a.index})},VideoStreamMerger.prototype.addMediaElement=function(a,b,c){var d=this;if(c=c||{},c.x=c.x||0,c.y=c.y||0,c.width=c.width||d.width,c.height=c.height||d.height,c.mute=c.mute||c.muted||!1,c.oldDraw=c.draw,c.oldAudioEffect=c.audioEffect,c.draw="VIDEO"===b.tagName||"IMG"===b.tagName?function(a,d,e){c.oldDraw?c.oldDraw(a,b,e):(a.drawImage(b,c.x,c.y,c.width,c.height),e())}:null,!c.mute){var e=b._mediaElementSource||d.getAudioContext().createMediaElementSource(b);b._mediaElementSource=e,e.connect(d.getAudioContext().destination);var f=d.getAudioContext().createGain();e.connect(f),b.muted?(b.muted=!1,b.volume=.001,f.gain.value=1e3):f.gain.value=1,c.audioEffect=function(a,b){c.oldAudioEffect?c.oldAudioEffect(f,b):f.connect(b)},c.oldAudioEffect=null}d.addStream(a,c)},VideoStreamMerger.prototype.addStream=function(a,b){var c=this;if("string"==typeof a)return c._addData(a,b);b=b||{};for(var d={isData:!1,x:b.x||0,y:b.y||0,width:b.width||c.width,height:b.height||c.height,draw:b.draw||null,mute:b.mute||b.muted||!1,audioEffect:b.audioEffect||null,index:null==b.index?0:b.index,hasVideo:0<a.getVideoTracks().length},e=null,f=0;f<c._streams.length;f++)c._streams[f].id===a.id&&(e=c._streams[f].element);e||(e=document.createElement("video"),e.autoplay=!0,e.muted=!0,e.srcObject=a,e.setAttribute("style","position:fixed; left: 0px; top:0px; pointer-events: none; opacity:0;"),document.body.appendChild(e),!d.mute&&(d.audioSource=c._audioCtx.createMediaStreamSource(a),d.audioOutput=c._audioCtx.createGain(),d.audioOutput.gain.value=1,d.audioEffect?d.audioEffect(d.audioSource,d.audioOutput):d.audioSource.connect(d.audioOutput),d.audioOutput.connect(c._audioDestination))),d.element=e,d.id=a.id||null,c._streams.push(d),c._sortStreams()},VideoStreamMerger.prototype.removeStream=function(a){var b=this;"string"==typeof a&&(a={id:a});for(var c=0;c<b._streams.length;c++)a.id===b._streams[c].id&&(b._streams[c].audioSource&&(b._streams[c].audioSource=null),b._streams[c].audioOutput&&(b._streams[c].audioOutput.disconnect(b._audioDestination),b._streams[c].audioOutput=null),b._streams[c]=null,b._streams.splice(c,1),c--)},VideoStreamMerger.prototype.updateStream=function(a,b){var c=this;"string"==typeof a&&(a={id:a});for(var d=0;d<c._streams.length;d++)if(a.id===c._streams[d].id){c._streams[d].x=b.x||0,c._streams[d].y=b.y||0,c._streams[d].width=b.width||c.width,c._streams[d].height=b.height||c.height;break}},VideoStreamMerger.prototype._addData=function(a,b){var c=this;b=b||{};var d={};d.isData=!0,d.draw=b.draw||null,d.audioEffect=b.audioEffect||null,d.id=a,d.element=null,d.index=null==b.index?0:b.index,d.audioEffect&&(d.audioOutput=c._audioCtx.createGain(),d.audioOutput.gain.value=1,d.audioEffect(null,d.audioOutput),d.audioOutput.connect(c._audioDestination)),c._streams.push(d),c._sortStreams()},VideoStreamMerger.prototype._requestAnimationFrame=function(a){var b=!1,c=setInterval(function(){!b&&document.hidden&&(b=!0,clearInterval(c),a())},1e3/self.fps);requestAnimationFrame(function(){b||(b=!0,clearInterval(c),a())})},VideoStreamMerger.prototype.start=function(){var a=this;a.started=!0,a._requestAnimationFrame(a._draw.bind(a)),a.result=a._canvas.captureStream(a.fps);var b=a.result.getAudioTracks()[0];b&&a.result.removeTrack(b);var c=a._audioDestination.stream.getAudioTracks();a.result.addTrack(c[0])},VideoStreamMerger.prototype._draw=function(){function a(){c--,0>=c&&b._requestAnimationFrame(b._draw.bind(b))}var b=this;if(b.started){var c=b._streams.length;b.clearRect&&b._ctx.clearRect(0,0,b.width,b.height),b._streams.forEach(function(c){c.draw?c.draw(b._ctx,c.element,a):!c.isData&&c.hasVideo?(b._ctx.drawImage(c.element,c.x,c.y,c.width,c.height),a()):a()}),0===b._streams.length&&a()}},VideoStreamMerger.prototype.destroy=function(){var a=this;a.started=!1,a._canvas=null,a._ctx=null,a._streams=[],a._audioCtx.close(),a._audioCtx=null,a._audioDestination=null,a.result.getTracks().forEach(function(a){a.stop()}),a.result=null};

},{}]},{},[1])(1)
});
