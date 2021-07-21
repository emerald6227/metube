const videoContainer = document.getElementById("videoContainer");
const form = document.querySelector(".video__add-comment--form");
const addCommentBtn = document.getElementById("btn__add-comment");
const cancleCommentBtn = document.getElementById("btn__cancle-comment"); 
const deleteCommentBtns = document.querySelectorAll(".deleteCommentBtn");

const addComment = (text, newCommentId, commentCreatedAt, ownerId, ownerName, avatarUrl, isHeroku) => {
    const videoComments = document.querySelector(".video__comments");
    const newComment = document.createElement("div");
    newComment.className = "video__comment";
    newComment.dataset.id = newCommentId;

    // owner info part
    const a = document.createElement("a");
    a.href= `/users/${ownerId}`;
    a.className = "video__comment--avatarWrapper";
    const img = document.createElement("img");
    img.className = "video__comment--avatar";
    img.src = isHeroku ? img.src = avatarUrl : imgsrc = `/${avatarUrl}`;

    a.appendChild(img);
    newComment.appendChild(a);

    // content part
    const contentDiv = document.createElement("div");
    contentDiv.className = "video__comment--content";
    const contentPrimaryDiv = document.createElement("div");
    contentPrimaryDiv.className = "video__comment--primary";
    
    const contentPrimaryDivLeft = document.createElement("div");
    contentPrimaryDivLeft.className = "video__comment-primary--left";
    const commentOwnerName = document.createElement("span");
    commentOwnerName.innerText = ownerName;
    const commentCreatedAtSpan = document.createElement("span");
    commentCreatedAtSpan.innerText = commentCreatedAt;

    const contentPrimaryDivRight = document.createElement("div");
    contentPrimaryDivRight.className = "video__comment-primary--right";
    const commentDeleteBtn = document.createElement("i");
    commentDeleteBtn.classList = "fas fa-times deleteCommentBtn";
    commentDeleteBtn.addEventListener("click", handleDeleteComment);

    const contentSecondaryDiv = document.createElement("div");
    contentSecondaryDiv.className = "video__comment--secondary";
    const contentText = document.createElement("span");
    contentText.innerText = text;

    contentPrimaryDivLeft.append(commentOwnerName, commentCreatedAtSpan);
    contentPrimaryDivRight.appendChild(commentDeleteBtn);
    contentPrimaryDiv.append(contentPrimaryDivLeft, contentPrimaryDivRight);
    contentSecondaryDiv.appendChild(contentText);
    contentDiv.append(contentPrimaryDiv, contentSecondaryDiv);
    newComment.appendChild(contentDiv);
    videoComments.prepend(newComment);
};

const handleSubmitComment = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("input");
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
        const { newCommentId, commentCreatedAt, ownerId, ownerName, avatarUrl, isHeroku } = await response.json();
        addComment(text, newCommentId, commentCreatedAt, ownerId, ownerName, avatarUrl, isHeroku);
    }
};

const handleDeleteComment = async (event) => {
    const comment = event.target.closest(".video__comment");
    const commentId = comment.dataset.id;

    const response = await fetch(`/api/videos/${commentId}/comment`, {
        method: "DELETE"
    });

    if (response.status === 200) {
        comment.remove();
    }
};

const handleCancleComment = (event) => {
    event.preventDefault();
    const textarea = form.querySelector("input");
    textarea.value = "";
};

if (form) {
    addCommentBtn.addEventListener("click", handleSubmitComment);
    cancleCommentBtn.addEventListener("click", handleCancleComment);
};

for (const deleteBtn of deleteCommentBtns) {
    deleteBtn.addEventListener("click", handleDeleteComment);
}