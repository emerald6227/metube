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

const previewVideoDuration = (video, durationSpan) => {
    durationSpan.innerText = formatTime(video.duration);
}

const handleLoadedPreviewVideoMetadata = (event) => {
    const video = event.target;
    const durationSpan = video.nextSibling;
    previewVideoDuration(video, durationSpan);
}

// heroku duration
const setPreviewVideoMetadata = (video, durationSpan) => {
    if (durationSpan.innerText === "00:00:00") {
        const metadataInterval = setInterval(previewVideoDuration, 1000, video, durationSpan);
        setTimeout(()=> {
            if (durationSpan.innerText !== "00:00:00") {
                clearInterval(metadataInterval);
            }
        }, 3000);
    }
}

if (videos) {
    for (const video of videos) {
        const durationSpan = video.nextSibling;
        video.addEventListener("loadedmetadata", handleLoadedPreviewVideoMetadata);
        setPreviewVideoMetadata(video, durationSpan);
    }
}

if (videoWrappers) {
    for (const videoWrapper of videoWrappers) {
        videoWrapper.addEventListener("mouseenter", handleStartPreviewVideo);
        videoWrapper.addEventListener("mouseleave", handleStopPreviewVideo);
    }
}