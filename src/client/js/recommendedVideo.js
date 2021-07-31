const watchContainer = document.getElementById("watch__container");
const primaryContainer = document.getElementById("watch-primary__container");
const secondaryContainer = document.getElementById("watch-secondary__container");

let isFullMode = true;

const secondaryContainerMemory = secondaryContainer;

const minimumRecommendedVideo = () => {
    if (isFullMode === true) {
        const videoOwnerInfo = primaryContainer.childNodes[2];
        secondaryContainer.remove();
        videoOwnerInfo.after(secondaryContainerMemory);
        isFullMode = false;
    }
};

const maximumRecommendedVideo = () => {
    if (isFullMode === false) {
        const secondaryContainerInPrimary = primaryContainer.childNodes[3];
        secondaryContainerInPrimary.remove();
        watchContainer.append(secondaryContainerMemory);
        isFullMode = true;
    }
};

const handleResizeScreen = (event) => {
    if (window.innerWidth <= 1015) {
        minimumRecommendedVideo();
    } else {
        maximumRecommendedVideo();
    }
};

window.addEventListener("resize", handleResizeScreen);
window.addEventListener("load", handleResizeScreen);