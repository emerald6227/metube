import fetch from 'node-fetch';

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteCommentBtns = document.querySelectorAll(".deleteCommentBtn");

const addComment = (text, id) => {
    const videoComments = document.querySelector(".video__comments");
    const newComment = document.createElement("div");
    newComment.className = "video__comment";
    newComment.dataset.id = id;

    const icon = document.createElement("i");
    icon.className = "fas fa-comment";

    const span = document.createElement("span");
    span.innerText = `${text}`;

    const deleteBtn = document.createElement("i");
    deleteBtn.className = "fas fa-times";
    deleteBtn.addEventListener("click", handleDeleteComment);

    newComment.appendChild(icon);
    newComment.appendChild(span);
    newComment.appendChild(deleteBtn);
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

    
    if (response.status === 201) {
        textarea.value = "";
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
    }
};

const handleDeleteComment = async (event) => {
    const comment = event.target.parentElement;
    const commentId = comment.dataset.id;

    const response = await fetch(`/api/videos/${commentId}/comment`, {
        method: "DELETE"
    });

    if (response.status === 200) {
        comment.remove();
    }
};

if (form) {
    form.addEventListener("submit", handleSubmitComment);
};

for (const deleteBtn of deleteCommentBtns) {
    deleteBtn.addEventListener("click", handleDeleteComment);
}