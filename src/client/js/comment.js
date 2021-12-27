const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleFormSubmit = (event) => {
    event.preventDefault();
    const textarea = form.querySelector("textarea");
    const text = textarea.value;
    const videoId = videoContainer.dataset.id;
    if (text === "") { return 0; }
    fetch(`/api/videos/${videoId}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
    });
};

form.addEventListener("submit", handleFormSubmit);