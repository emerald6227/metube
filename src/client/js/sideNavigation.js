const navBoxDiv = document.getElementById("nav-box");
const homeContainer = document.getElementById("home-container")
const navMenu = document.querySelectorAll(".nav-menu");

let isNavigationMaximum = true;

const navMenuMemory = [navMenu[2], navMenu[3]];

const minimumNavigation = () => {
    isNavigationMaximum = false;

    if (navMenu.length > 0) { // 없을시 import 때 undefined 에러발생
        navMenu[2].remove();
        navMenu[3].remove();
    }
};

const maximumNavigation = () => {
    isNavigationMaximum = true;

    if (navBoxDiv) {
        navBoxDiv.append(navMenuMemory[0], navMenuMemory[1]);
    }
};

const handleResizeScreen = () => {
    const windowWidth = window.innerWidth;
    
    if (homeContainer) {
        if (windowWidth <= 1328) {
            minimumNavigation();
        } else {
            maximumNavigation();
        }
    }
}

window.addEventListener("resize", handleResizeScreen);
window.addEventListener("load", handleResizeScreen);