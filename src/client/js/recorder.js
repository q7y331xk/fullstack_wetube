import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const record = document.getElementById("record");
const preview = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg"
};

const downloadFile = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
};

const handleDownload = async() => {
    record.removeEventListener("click", handleDownload);
    record.innerText = "Transcodeing...";
    record.disabled = true;
    //record.style.cursor = disabled 넣어줘도 좋을듯

    const ffmpeg = createFFmpeg({ log: true });
    await ffmpeg.load();

    ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
    
    await ffmpeg.run("-i", files.input, "-r", "60", files.output);
    await ffmpeg.run("-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

    const mp4File = ffmpeg.FS("readFile", files.output);
    const thumbFile = ffmpeg.FS("readFile", files.thumb);

    const mp4Blob = new Blob([mp4File.buffer], {type: "video/mp4"});
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});    

    const mp4Url = new URL.createObjectURL(mp4Blob);
    const thumbUrl = new URL.createObjectURL(thumbBlob);

    downloadFile(mp4Url, "MyRecording.mp4"); 
    downloadFile(thumbUrl, "MyThumbnail.jpg"); 

    ffmpeg.FS("unlink",files.input);
    ffmpeg.FS("unlink",files.output);
    ffmpeg.FS("unlink",files.thumb);
    
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(videoFile);
    
    record.disabled = false;
    record.innerText = "Record Again";
    record.addEventListener("click", handleRecord);
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
    stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: {
        width: 1024,
        height: 576,
    },});
    preview.srcObject = stream;
    preview.play();
};

init();

record.addEventListener("click", handleRecord);