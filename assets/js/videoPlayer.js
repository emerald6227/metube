(()=>{var e={933:(e,t)=>{"use strict";var n=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==n)return n;throw new Error("unable to locate global object")}();e.exports=t=n.fetch,n.fetch&&(t.default=n.fetch.bind(n)),t.Headers=n.Headers,t.Request=n.Request,t.Response=n.Response}},t={};function n(u){var o=t[u];if(void 0!==o)return o.exports;var a=t[u]={exports:{}};return e[u](a,a.exports,n),a.exports}(()=>{var e=n(933).default,t=document.querySelector("video"),u=document.getElementById("play"),o=u.querySelector("i"),a=document.getElementById("mute"),d=a.querySelector("i"),r=document.getElementById("volume"),i=document.getElementById("currentTime"),s=document.getElementById("totalTime"),l=document.getElementById("timeline"),c=document.getElementById("fullScreen"),m=c.querySelector("i"),f=document.getElementById("videoContainer"),v=document.getElementById("videoControls"),E=document.getElementById("commentForm").querySelector("textarea"),p=!1,y=null,L=null,g=1;t.volume=g,window.onkeydown=function(e){var t=e.code;p||("KeyF"===t?w():"Space"===t&&(e.preventDefault(),T()))};var h=function(e){return new Date(1e3*e).toISOString().substr(11,8)},T=function(e){t.paused?t.play():t.pause(),o.classList=t.paused?"fas fa-play":"fas fa-pause"},w=function(e){var n=document.fullscreenElement;n?(document.exitFullscreen(),t.style.height="70vh"):(f.requestFullscreen(),t.style.height="100vh"),m.classList=n?"fas fa-expand":"fas fa-compress"},x=function(){return v.classList.remove("showing")};u.addEventListener("click",T),a.addEventListener("click",(function(e){t.muted?t.muted=!1:t.muted=!0,d.classList=t.muted?"fas fa-volume-mute":"fas fa-volume-up",r.value=t.muted?0:g})),r.addEventListener("input",(function(e){var n=e.target.value;t.muted&&(t.muted=!1),0==n&&(t.muted=!0),d.classList=t.muted?"fas fa-volume-mute":"fas fa-volume-up",g=n,t.volume=n})),l.addEventListener("input",(function(e){var n=e.target.value;t.currentTime=n})),c.addEventListener("click",w),t.addEventListener("loadedmetadata",(function(){s.innerText=h(Math.floor(t.duration)),l.max=Math.floor(t.duration)})),t.addEventListener("timeupdate",(function(){i.innerText=h(Math.floor(t.currentTime)),l.value=Math.floor(t.currentTime)})),t.addEventListener("click",T),t.addEventListener("mousemove",(function(){y&&(clearTimeout(y),y=null),L&&(clearTimeout(L),L=null),v.classList.add("showing"),L=setTimeout(x,3e3)})),t.addEventListener("mouseleave",(function(){y=setTimeout(x,3e3)})),t.addEventListener("ended",(function(){var t=f.dataset.id;e("/api/videos/".concat(t,"/view"),{method:"POST"})})),v.addEventListener("mouseover",(function(){y&&(clearTimeout(y),y=null),L&&(clearTimeout(L),L=null),v.classList.add("showing")})),v.addEventListener("mouseleave",(function(){y=setTimeout(x,3e3)})),E&&(E.addEventListener("focus",(function(){p=!0})),E.addEventListener("blur",(function(){p=!1})))})()})();