import Video from "../models/Video";

const handleSearch = (error, videos) => {
    console.log("errors",error);
    console.log("videos", videos);
};

export const home = async(req, res) => {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home" , videos});
};
export const watch = (req, res) => {
    const { id } = req.params;   
    return res.render("watch", { pageTitle: `Watching`});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", { pageTitle: `Editing`});
};
export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};
export const  getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};
export const  postUpload = (req, res) => {
    // here we will add a video to the videos array.
    const {title} = req.body;
  
    return res.redirect("/");
};




export const search = (req, res) => res.send("video search");
export const deleteVideo = (req, res) => res.send("delete video");
export const upload = (req, res) => res.send("upload video");
