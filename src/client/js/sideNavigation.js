const navBoxDiv = document.getElementById("nav-box");
const homeContainer = document.getElementById("home-container")
const navMenu = document.querySelectorAll(".nav-menu");
const navMenuLogin = document.querySelector(".nav-menu__login");

let notLoggedInUser = false;

const navMenuMemory = [navMenu[2], navMenu[3]];
const navMenuLoginMemory = navMenuLogin;


const minimumNavigation = () => {
    if (navMenu) {
        if (notLoggedInUser) {
            navMenuLogin.remove();
        }
        navMenu[2].remove();
        navMenu[3].remove();
    }
};

const maximumNavigation = () => {
    if (navBoxDiv) {
        if (notLoggedInUser) {
            navBoxDiv.append(navMenuLoginMemory);
        }
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

const init = () => {
    if (navMenuLogin) {
        notLoggedInUser = true;
    }
}

init();

window.addEventListener("resize", handleResizeScreen);
window.addEventListener("load", handleResizeScreen);