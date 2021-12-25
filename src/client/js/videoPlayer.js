const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const muteBtn = document.getElementById("mute");
const volume = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");
const fullScreen = document.getElementById("fullScreen");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let mouseMoveTimeout = null;
let volumeValue = 1;
video.volume = volumeValue;

const handlePlayBtn = (e) => {
    if(video.paused) {
        video.play();
    } else {
        video.pause();
    }
    playBtn.innerText = video.paused ? "Play" : "Pause";
};
const handleMuteBtn = (e) => {
    if (video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
        volume.value = volumeValue;
    } else {
        video.muted = true;
        muteBtn.innerText = "Unmute";
        volume.value = 0;
    }
};
const handleVolumeInput = (e) => {
    if (video.muted && e.target.value != 0) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = e.target.value;
    video.volume = e.target.value;
};
const formatTime = (seconds) => {
    return (new Date(seconds * 1000)).toISOString().substring(11,19);
};
const handleLoadedMetaData = (e) => {
    totalTime.innerText = formatTime(Math.floor(video.duration));
    timeLine.max = Math.floor(video.duration);
};
const handleTimeUpdate = (e) => {
    currentTime.innerText = formatTime(Math.floor(video.currentTime));
    timeLine.value = Math.floor(video.currentTime);
};
const handleTimelineInput = (event) => {
    const {
        target: {value},
    } = event;
    video.currentTime = value;
};
const handleFullScreen = () => {
    const fullscreen = document.fullscreenElement;
    if (fullscreen) {
        document.exitFullscreen();
        fullScreen.innerText = "Enter Full Screen";
    } else {
        videoContainer.requestFullscreen();
        fullScreen.innerText="Exit Full Screen";
    }
}

const hideControls = () => { videoControls.classList.remove("showing") };

const handleMouseMove = (e) => {
    if (controlsTimeout) {
        clearTimeout(controlsTimeout);
        controlsTimeout = null;
    }
    if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout)
        mouseMoveTimeout = null;
    }
    videoControls.classList.add("showing");
    mouseMoveTimeout = setTimeout(hideControls, 3000);
};
const handleMouseLeave = (e) => {
    controlsTimeout = setTimeout(hideControls, 3000);
};
const handleEnded = (e) => {
    const { id } = videoContainer.dataset;
    fetch(`/api/videos/${id}/view`,{ method: "POST" });
};
playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMuteBtn); 
volume.addEventListener("input", handleVolumeInput);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);

timeLine.addEventListener("input", handleTimelineInput);
fullScreen.addEventListener("click", handleFullScreen);

video.addEventListener("mousemove",handleMouseMove);
video.addEventListener("mouseleave",handleMouseLeave);