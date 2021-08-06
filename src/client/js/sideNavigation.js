import regeneratorRuntime from "regenerator-runtime";

const navBoxDiv = document.getElementById("nav-box");
const homeContainer = document.getElementById("home-container")
const navMenu = document.querySelectorAll(".nav-menu");
const navMenuLogin = document.querySelector(".nav-menu__login");

let notLoggedInUser = false;
let HEROKU = false;

const navMenuMemory = [navMenu[2], navMenu[3], navMenu[4]];
const navMenuLoginMemory = navMenuLogin;

const DEFAULT_SUBSCRIBE_COUNT = 7;
let subscribedListDevidedCount = 0;
let subscribedListMemory = [];
let isExtendsubscribedList = false;

const minimumNavigation = () => {
    if (navMenu) {
        if (notLoggedInUser) {
            navMenuLogin.remove();
        }
        navMenu[2].remove();
        navMenu[3].remove();
        navMenu[4].remove();
    }
};

const maximumNavigation = () => {
    if (navBoxDiv) {
        if (notLoggedInUser) {
            navBoxDiv.append(navMenuLoginMemory);
        }
        navBoxDiv.append(navMenuMemory[0], navMenuMemory[1], navMenuMemory[2]);
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

const handleEnterScrollbar = () => {
    homeContainer.classList.add("showScrollbar");
    
};

const handleLeaveScrollbar = () => {
    homeContainer.classList.remove("showScrollbar");
}

const handleMoreDetailSubscribedList = (event) => {
    const i = event.target.childNodes[0];
    const span = event.target.childNodes[1];

    if (isExtendsubscribedList) {
        // reduce Subscribed List
        const subscribedNavItems = navMenu[2].childNodes;

        for (let idx = subscribedNavItems.length - 2; idx > DEFAULT_SUBSCRIBE_COUNT; idx--) {
            subscribedNavItems[idx].remove();
        }
        i.classList = "fas fa-chevron-down";
        span.innerText = `${subscribedListDevidedCount}개 더보기`;
        isExtendsubscribedList = false;
    } else {
        // extend Subscribed List
        for (let idx = 0; idx < subscribedListMemory.length; idx++) {
            paintSubscribedList(subscribedListMemory[idx], true);
        }
        i.classList = "fas fa-chevron-up";
        span.innerText = "간략히";
        isExtendsubscribedList = true;
    }
};

const paintSubscribedList = (subscribeInfo, isMoreDetail) => {
    const navMenuItemAnchor = document.createElement("a");
    navMenuItemAnchor.href= `users/${subscribeInfo.id}`;
    navMenuItemAnchor.classList.add("subscribe-wrapper");

    const navMenuItem = document.createElement("div");
    navMenuItem.classList.add("nav-menu__item--subscribe");
    
    const avatarImg = document.createElement("img");
    avatarImg.classList.add("subscribe-avatar");
    if (!HEROKU || subscribeInfo.avatarUrl === `images/default-profile.png`) {
        avatarImg.src = `/${subscribeInfo.avatarUrl}`;
    } else {
        avatarImg.src = subscribeInfo.avatarUrl;
    }

    const span = document.createElement("span");
    span.innerText = subscribeInfo.name;

    navMenuItem.append(avatarImg);
    navMenuItem.append(span);
    navMenuItemAnchor.append(navMenuItem);

    if (!isMoreDetail) {
        navMenu[2].append(navMenuItemAnchor);
    } else {
        const moreDetail = document.querySelector(".more-detail");
        moreDetail.before(navMenuItemAnchor);
    }
}

// subscribed list
const displaySubscribeList = (subscribeInfoList) => {
    if (subscribeInfoList.length === 0) {
        const navMenuSubscribed = document.createElement("div");
        navMenuSubscribed.classList.add("nav-menu__notification");

        const noSubscribedSpan = document.createElement("span");
        noSubscribedSpan.innerText = "구독중인 채널이 없습니다";

        navMenuSubscribed.append(noSubscribedSpan);
        navMenu[2].append(navMenuSubscribed);
    } else {
        // 기본 구독자 표시
        let devideDiv = false;
        for (let idx = 0; idx < subscribeInfoList.length; idx++) {
            if (idx >= DEFAULT_SUBSCRIBE_COUNT) {
                devideDiv = true;
                break;
            };

            paintSubscribedList(subscribeInfoList[idx], false);
        }
        
        // DEFAULT_SUBSCRIBE_COUNT명 이상 구독자는 숨김
        if (devideDiv) {
            // 더보기 버튼
            subscribedListDevidedCount = subscribeInfoList.length - DEFAULT_SUBSCRIBE_COUNT;
            const navMenuItem = document.createElement("div");
            navMenuItem.classList.add("nav-menu__item", "more-detail");
            navMenuItem.addEventListener("click", handleMoreDetailSubscribedList);

            const i = document.createElement("i");
            i.classList.add("fas", "fa-chevron-down");

            const span = document.createElement("span");
            span.innerText = `${subscribedListDevidedCount}개 더보기`;

            navMenuItem.append(i);
            navMenuItem.append(span);
            navMenu[2].append(navMenuItem);

            // 나머지 정보 기억
            for (let i = DEFAULT_SUBSCRIBE_COUNT; i < subscribeInfoList.length; i++) {
                subscribedListMemory.push(subscribeInfoList[i]);
            }
        };
    }
};

const getSubscribedList = async () => {
    const response = await fetch(`/api/subscribedList`, {
        method: "GET"
    });

    if (response.status === 200) {
        const { subscribeInfoList, isHeroku } = await response.json();
        HEROKU = isHeroku;
        displaySubscribeList(subscribeInfoList);
    }
};

const init = () => {
    if (navMenuLogin) {
        notLoggedInUser = true;
    } else{
        getSubscribedList();
    }
}

init();

window.addEventListener("resize", handleResizeScreen);
window.addEventListener("load", handleResizeScreen);
navBoxDiv.addEventListener("mouseenter", handleEnterScrollbar);
navBoxDiv.addEventListener("mouseleave", handleLeaveScrollbar);