const record = document.getElementById("record");
const preview = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording.webm";
    document.body.appendChild(a);
    a.click();
};

const handleRecordStop = (e) => {
    record.innerText = "Download Recording";
    record.removeEventListener("click", handleRecordStop);
    record.addEventListener("click", handleDownload);
    recorder.stop();
};

const handleRecord = (e) => {
    record.innerText = "Stop Recording";
    record.removeEventListener("click", handleRecord);
    record.addEventListener("click", handleRecordStop);
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        videoFile = URL.createObjectURL(e.data);
        preview.srcObject = null;
        preview.src = videoFile;
        preview.loop = true;
        preview.play();
    };
    recorder.start();
};
const init = async(e) => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    preview.srcObject = stream;
    preview.play();
};


init();

record.addEventListener("click", handleRecord);