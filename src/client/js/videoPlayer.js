import cookie, { getCookie, setPermanentCookie } from "./cookie.js";

const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeTimer = null;

// Comment
const addCommentForm = document.querySelector(".video__add-comment--form");
let textarea = "";
if (addCommentForm) {
    textarea = addCommentForm.querySelector("input");
}
let textFocusState = false;

let controlsLeaveTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 1;
video.volume = volumeValue;

const keyDownEvent = window.onkeydown = (event) => {
    const { code } = event;

    if (!textFocusState) {
        if (code === "KeyF") {
            handleFullScreen();
        } else if (code === "Space") {
            event.preventDefault();
            handlePlayClick();
        }
    }
    
};

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

const handlePlayClick = (event) => {
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const setVolumeCookie = () => {
    if (volumeTimer) {
        clearTimeout(volumeTimer);
    }

    volumeTimer = setTimeout(() => {
        setPermanentCookie("currentVolume", volumeRange.value, 365 * 1000);
        }, 200
    );
}

const handleMute = (event) => {
    if (video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ?  "fas fa-volume-mute" : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;

    setVolumeCookie();
};

const handleVolumeChange = (event) => {
    const { target: { value } } = event;
    if (video.muted) {
        video.muted = false;
    }
    if (value == 0) {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted ?  "fas fa-volume-mute" : "fas fa-volume-up";

    volumeValue = value;
    video.volume = value;

    setVolumeCookie();
}

const handleLoadedMetadata = () => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
};

if (totalTime.innerText === "00:00:00") {
    const metadataInterval = setInterval(handleLoadedMetadata, 1000);
    setTimeout(()=> {
        if (totalTime.innerText !== "00:00:00") {
            clearInterval(metadataInterval);
        }
    }, 3000);
}

const handleTimeUpdate = () => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
    const { target: { value } } = event;
    video.currentTime = value;
};

const handleFullScreen = (event) => {
    const fullScreen = document.fullscreenElement;

    if (fullScreen) {
        document.exitFullscreen();
    } else {
        videoContainer.requestFullscreen();
    }
    fullScreenBtnIcon.classList = fullScreen ? "fas fa-expand" : "fas fa-compress";
};

const hideControls = () => videoControls.classList.remove("showing");

const handleVideoMouseMove = () => {
    if (controlsLeaveTimeout) {
        clearTimeout(controlsLeaveTimeout);
        controlsLeaveTimeout = null;
    }

    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }

    videoControls.classList.add("showing");
    controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleVideoMouseLeave = () => {
    controlsLeaveTimeout = setTimeout(hideControls, 3000);
};

const handleControlsMouseOver = () => {
    if (controlsLeaveTimeout) {
        clearTimeout(controlsLeaveTimeout);
        controlsLeaveTimeout = null;
    }

    if (controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }

    videoControls.classList.add("showing");
};

const handleControlsMouseLeave = () => {
    controlsLeaveTimeout = setTimeout(hideControls, 3000);
};

const handleVideoEnded = () => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`, { method: "POST" });
}

const init = async () => {
    const currentVolume = await getCookie("currentVolume");
    if (currentVolume) {
        volumeRange.value = currentVolume;
        video.volume = currentVolume;

        if (currentVolume === "0") {
            video.muted = true;
            muteBtnIcon.classList = "fas fa-volume-mute";
        }
    }

    handlePlayClick();
}

window.addEventListener("load", init);

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
timeLine.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);

video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("mousemove", handleVideoMouseMove);
video.addEventListener("mouseleave", handleVideoMouseLeave);
video.addEventListener("ended", handleVideoEnded);

videoControls.addEventListener("mouseover", handleControlsMouseOver);
videoControls.addEventListener("mouseleave", handleControlsMouseLeave);

// Comment
if (textarea) {
    textarea.addEventListener("focus", () => { textFocusState = true });
    textarea.addEventListener("blur", () => { textFocusState = false });
}