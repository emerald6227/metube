(()=>{var e=document.querySelector("video"),t=document.getElementById("play"),n=t.querySelector("i"),u=document.getElementById("mute"),a=u.querySelector("i"),o=document.getElementById("volume"),d=document.getElementById("currentTime"),i=document.getElementById("totalTime"),r=document.getElementById("timeline"),l=document.getElementById("fullScreen"),c=l.querySelector("i"),s=document.getElementById("videoContainer"),m=document.getElementById("videoControls"),v=document.querySelector(".video__add-comment--form"),f="";v&&(f=v.querySelector("input"));var E=!1,L=null,y=null,p=1;e.volume=p,window.onkeydown=function(e){var t=e.code;E||("KeyF"===t?h():"Space"===t&&(e.preventDefault(),g()))};var T=function(e){return new Date(1e3*e).toISOString().substr(11,8)},g=function(t){e.paused?e.play():e.pause(),n.classList=e.paused?"fas fa-play":"fas fa-pause"},I=function(){i.innerText=T(Math.floor(e.duration)),r.max=Math.floor(e.duration)};if("00:00:00"===i.innerText){var S=setInterval(I,1e3);setTimeout((function(){"00:00:00"!==i.innerText&&clearInterval(S)}),3e3)}var h=function(e){var t=document.fullscreenElement;t?document.exitFullscreen():s.requestFullscreen(),c.classList=t?"fas fa-expand":"fas fa-compress"},B=function(){return m.classList.remove("showing")};g(),t.addEventListener("click",g),u.addEventListener("click",(function(t){e.muted?e.muted=!1:e.muted=!0,a.classList=e.muted?"fas fa-volume-mute":"fas fa-volume-up",o.value=e.muted?0:p})),o.addEventListener("input",(function(t){var n=t.target.value;e.muted&&(e.muted=!1),0==n&&(e.muted=!0),a.classList=e.muted?"fas fa-volume-mute":"fas fa-volume-up",p=n,e.volume=n})),r.addEventListener("input",(function(t){var n=t.target.value;e.currentTime=n})),l.addEventListener("click",h),e.addEventListener("loadedmetadata",I),e.addEventListener("timeupdate",(function(){d.innerText=T(Math.floor(e.currentTime)),r.value=Math.floor(e.currentTime)})),e.addEventListener("click",g),e.addEventListener("mousemove",(function(){L&&(clearTimeout(L),L=null),y&&(clearTimeout(y),y=null),m.classList.add("showing"),y=setTimeout(B,3e3)})),e.addEventListener("mouseleave",(function(){L=setTimeout(B,3e3)})),e.addEventListener("ended",(function(){var e=s.dataset.id;fetch("/api/videos/".concat(e,"/view"),{method:"POST"})})),m.addEventListener("mouseover",(function(){L&&(clearTimeout(L),L=null),y&&(clearTimeout(y),y=null),m.classList.add("showing")})),m.addEventListener("mouseleave",(function(){L=setTimeout(B,3e3)})),f&&(f.addEventListener("focus",(function(){E=!0})),f.addEventListener("blur",(function(){E=!1})))})();