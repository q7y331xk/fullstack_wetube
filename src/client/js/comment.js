const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text, id) => {
    const videoList = document.querySelector(".video__comments ul");
    const newComment = document.createElement("li");
    newComment.dataset.id = id;
    newComment.innerText = text;
    videoList.prepend(newComment);
};

const handleFormSubmit = async (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    let text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") { return 0; }
    const response = await fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
    
    if (response.status === 201) {
        const { newCommentId } = await response.json();
        addComment(text, newCommentId);
        text = "";
    }
};

form.addEventListener("submit", handleFormSubmit);