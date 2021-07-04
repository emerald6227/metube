/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/js/videoPlayer.js":
/*!**************************************!*\
  !*** ./src/client/js/videoPlayer.js ***!
  \**************************************/
/***/ (() => {

eval("var video = document.querySelector(\"video\");\nvar playBtn = document.getElementById(\"play\");\nvar playBtnIcon = playBtn.querySelector(\"i\");\nvar muteBtn = document.getElementById(\"mute\");\nvar muteBtnIcon = muteBtn.querySelector(\"i\");\nvar volumeRange = document.getElementById(\"volume\");\nvar currentTime = document.getElementById(\"currentTime\");\nvar totalTime = document.getElementById(\"totalTime\");\nvar timeLine = document.getElementById(\"timeline\");\nvar fullScreenBtn = document.getElementById(\"fullScreen\");\nvar fullScreenBtnIcon = fullScreenBtn.querySelector(\"i\");\nvar videoContainer = document.getElementById(\"videoContainer\");\nvar videoControls = document.getElementById(\"videoControls\"); // Comment\n\nvar commentForm = document.getElementById(\"commentForm\");\nvar textarea = commentForm.querySelector(\"textarea\");\nvar textFocusState = false;\nvar controlsLeaveTimeout = null;\nvar controlsMovementTimeout = null;\nvar volumeValue = 1;\nvideo.volume = volumeValue;\n\nvar keyDownEvent = window.onkeydown = function (event) {\n  var code = event.code;\n\n  if (!textFocusState) {\n    if (code === \"KeyF\") {\n      handleFullScreen();\n    } else if (code === \"Space\") {\n      event.preventDefault();\n      handlePlayClick();\n    }\n  }\n};\n\nvar formatTime = function formatTime(seconds) {\n  return new Date(seconds * 1000).toISOString().substr(11, 8);\n};\n\nvar handlePlayClick = function handlePlayClick(event) {\n  if (video.paused) {\n    video.play();\n  } else {\n    video.pause();\n  }\n\n  playBtnIcon.classList = video.paused ? \"fas fa-play\" : \"fas fa-pause\";\n};\n\nvar handleMute = function handleMute(event) {\n  if (video.muted) {\n    video.muted = false;\n  } else {\n    video.muted = true;\n  }\n\n  muteBtnIcon.classList = video.muted ? \"fas fa-volume-mute\" : \"fas fa-volume-up\";\n  volumeRange.value = video.muted ? 0 : volumeValue;\n};\n\nvar handleVolumeChange = function handleVolumeChange(event) {\n  var value = event.target.value;\n\n  if (video.muted) {\n    video.muted = false;\n  }\n\n  if (value == 0) {\n    video.muted = true;\n  }\n\n  muteBtnIcon.classList = video.muted ? \"fas fa-volume-mute\" : \"fas fa-volume-up\";\n  volumeValue = value;\n  video.volume = value;\n};\n\nvar handleLoadedMetadata = function handleLoadedMetadata() {\n  totalTime.innerText = formatTime(Math.floor(video.duration));\n  timeLine.max = Math.floor(video.duration);\n};\n\nvar handleTimeUpdate = function handleTimeUpdate() {\n  currentTime.innerText = formatTime(Math.floor(video.currentTime));\n  timeLine.value = Math.floor(video.currentTime);\n};\n\nvar handleTimelineChange = function handleTimelineChange(event) {\n  var value = event.target.value;\n  video.currentTime = value;\n};\n\nvar handleFullScreen = function handleFullScreen(event) {\n  var fullScreen = document.fullscreenElement;\n\n  if (fullScreen) {\n    document.exitFullscreen();\n    video.style.height = \"70vh\";\n  } else {\n    videoContainer.requestFullscreen();\n    video.style.height = \"100vh\";\n  }\n\n  fullScreenBtnIcon.classList = fullScreen ? \"fas fa-expand\" : \"fas fa-compress\";\n};\n\nvar hideControls = function hideControls() {\n  return videoControls.classList.remove(\"showing\");\n};\n\nvar handleVideoMouseMove = function handleVideoMouseMove() {\n  if (controlsLeaveTimeout) {\n    clearTimeout(controlsLeaveTimeout);\n    controlsLeaveTimeout = null;\n  }\n\n  if (controlsMovementTimeout) {\n    clearTimeout(controlsMovementTimeout);\n    controlsMovementTimeout = null;\n  }\n\n  videoControls.classList.add(\"showing\");\n  controlsMovementTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleVideoMouseLeave = function handleVideoMouseLeave() {\n  controlsLeaveTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleControlsMouseOver = function handleControlsMouseOver() {\n  if (controlsLeaveTimeout) {\n    clearTimeout(controlsLeaveTimeout);\n    controlsLeaveTimeout = null;\n  }\n\n  if (controlsMovementTimeout) {\n    clearTimeout(controlsMovementTimeout);\n    controlsMovementTimeout = null;\n  }\n\n  videoControls.classList.add(\"showing\");\n};\n\nvar handleControlsMouseLeave = function handleControlsMouseLeave() {\n  controlsLeaveTimeout = setTimeout(hideControls, 3000);\n};\n\nvar handleVideoEnded = function handleVideoEnded() {\n  var id = videoContainer.dataset.id;\n  fetch(\"/api/videos/\".concat(id, \"/view\"), {\n    method: \"POST\"\n  });\n};\n\nplayBtn.addEventListener(\"click\", handlePlayClick);\nmuteBtn.addEventListener(\"click\", handleMute);\nvolumeRange.addEventListener(\"input\", handleVolumeChange);\ntimeLine.addEventListener(\"input\", handleTimelineChange);\nfullScreenBtn.addEventListener(\"click\", handleFullScreen);\nvideo.addEventListener(\"loadedmetadata\", handleLoadedMetadata);\nvideo.addEventListener(\"timeupdate\", handleTimeUpdate);\nvideo.addEventListener(\"click\", handlePlayClick);\nvideo.addEventListener(\"mousemove\", handleVideoMouseMove);\nvideo.addEventListener(\"mouseleave\", handleVideoMouseLeave);\nvideo.addEventListener(\"ended\", handleVideoEnded);\nvideoControls.addEventListener(\"mouseover\", handleControlsMouseOver);\nvideoControls.addEventListener(\"mouseleave\", handleControlsMouseLeave); // Comment\n\nif (textarea) {\n  textarea.addEventListener(\"focus\", function () {\n    textFocusState = true;\n  });\n  textarea.addEventListener(\"blur\", function () {\n    textFocusState = false;\n  });\n}\n\n//# sourceURL=webpack://metube/./src/client/js/videoPlayer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/client/js/videoPlayer.js"]();
/******/ 	
/******/ })()
;