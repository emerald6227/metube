import fetch from 'node-fetch';

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
    const videoComments = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.className = "video__comment";

    const icon = document.createElement("i");
    icon.className = "fas fa-comment";

    const span = document.createElement("span");
    span.innerText = `${text}`;

    newComment.appendChild(icon);
    newComment.appendChild(span);
    videoComments.prepend(newComment);
};

const handleSubmitComment = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;

    if (text === "") {
        return;
    }

    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
    });

    textarea.value = "";

    if (response.status === 201) {
        addComment(text);
    }
};

if (form) {
    form.addEventListener("submit", handleSubmitComment);
};