const videos = document.querySelectorAll(".preview-video");
const videoWrappers = document.querySelectorAll(".recommended-video__wrapper");

let previewVideoMouseOver = false;
let previewVideoIntervalReset = null;
let previewVideoIntervalPlay = null;

const formatTime = (seconds) =>
    new Date(seconds * 1000).toISOString().substr(11, 8);

const handleStartPreviewVideo = (event) => {
    const video = event.target.firstChild;

    video.play();
    previewVideoIntervalReset = setInterval(() => { 
        video.pause(); 
        video.load();
    }, 3000);
    previewVideoIntervalPlay = setInterval(() => { 
        video.play();
    }, 3100);
}

const handleStopPreviewVideo = (event) => {
    const video = event.target.firstChild;
    video.pause();
    video.load();

    clearInterval(previewVideoIntervalReset);
    clearInterval(previewVideoIntervalPlay);
    previewVideoIntervalReset = null;
    previewVideoIntervalPlay = null;
    
}

const handleLoadedPreviewVideoMetadata = (event) => {
    const span = event.target.nextSibling;
    span.innerText = formatTime(event.target.duration);
}

if (videos) {
    for (const video of videos) {
        video.addEventListener("loadedmetadata", handleLoadedPreviewVideoMetadata);
    }
}

if (videoWrappers) {
    for (const videoWrapper of videoWrappers) {
        videoWrapper.addEventListener("mouseenter", handleStartPreviewVideo);
        videoWrapper.addEventListener("mouseleave", handleStopPreviewVideo);
    }
}