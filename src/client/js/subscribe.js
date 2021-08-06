const subscribeBtn = document.querySelector(".subscribe-btn");
const unSubscribeBtn = document.querySelector(".unsubscribe-btn");

const profileAdditionalInfoDiv = document.querySelector(".profile__additional-info");
const watchAdditionalInfoDiv = document.getElementById("video_owner-primary-info--right");

let ownerUserId = null;

const changeSubscriberCount = (parentNode, isIncrease) => {
    const subscriberCount = document.querySelector(".subscriber-count");
    const subscriberCountText = subscriberCount.innerText;
    let subscriberNum = Number(subscriberCountText.substr(4, 1));

    if (isIncrease === true) {
        subscriberNum += 1;
    } else {
        subscriberNum -= 1;
    }

    subscriberCount.innerText = `구독자 ${subscriberNum}명`;
}

const changeToUnsubscribe = () => {
    const newUnSubscribeBtn = document.createElement("button");
    newUnSubscribeBtn.classList.add("unsubscribe-btn");
    newUnSubscribeBtn.dataset.id = ownerUserId;
    newUnSubscribeBtn.innerText = "구독 취소";
    newUnSubscribeBtn.addEventListener("click", handleUnSubscribe);

    if (profileAdditionalInfoDiv) {
        profileAdditionalInfoDiv.append(newUnSubscribeBtn);
        changeSubscriberCount(profileAdditionalInfoDiv, true);
    } else if (watchAdditionalInfoDiv) {
        watchAdditionalInfoDiv.append(newUnSubscribeBtn);
        changeSubscriberCount(watchAdditionalInfoDiv, true);
    }

    const beforeSubscribeBtn = document.querySelector(".subscribe-btn");
    beforeSubscribeBtn.remove();
};

const changeToSubscribe = () => {
    const newSubscribeBtn = document.createElement("button");
    newSubscribeBtn.classList.add("subscribe-btn");
    newSubscribeBtn.dataset.id = ownerUserId;
    newSubscribeBtn.innerText = "구독";
    newSubscribeBtn.addEventListener("click", handleSubscribe);

    if (profileAdditionalInfoDiv) {
        profileAdditionalInfoDiv.append(newSubscribeBtn);
        changeSubscriberCount(profileAdditionalInfoDiv, false);
    } else if (watchAdditionalInfoDiv) {
        watchAdditionalInfoDiv.append(newSubscribeBtn);
        changeSubscriberCount(watchAdditionalInfoDiv, false);
    }

    const beoforeUnSubscribeBtn = document.querySelector(".unsubscribe-btn");
    beoforeUnSubscribeBtn.remove();
};

const handleSubscribe = async (event) => {
    event.preventDefault();
    const subscribeToId = event.target.dataset.id;
    ownerUserId = subscribeToId;
    if (subscribeToId === undefined) {
        return;
    }

    const response = await fetch(`/api/subscribe/${subscribeToId}`, {
        method: "POST",
    });

    if (response.status === 201) {
        changeToUnsubscribe();
    }

};

const handleUnSubscribe = async (event) => {
    event.preventDefault();
    const subscribeToId = event.target.dataset.id;
    ownerUserId = subscribeToId;
    if (subscribeToId === undefined) {
        return;
    }

    const response = await fetch(`/api/subscribe/${subscribeToId}`, {
        method: "DELETE"
    });

    if (response.status === 200) {
        changeToSubscribe();
    }
};

if (subscribeBtn) {
    subscribeBtn.addEventListener("click", handleSubscribe);
}
if (unSubscribeBtn) {
    unSubscribeBtn.addEventListener("click", handleUnSubscribe);
}