import Video from "../models/Video";

const handleSearch = (error, videos) => {
    console.log("errors",error);
    console.log("videos", videos);
};

export const home = async(req, res) => {
    const videos = await Video.find({}).sort({ createdAt: "asc" });
    return res.render("home", { pageTitle: "Home" , videos});
};
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", { pageTitle: "Video not Found."});
    }
    return res.render("watch", { pageTitle: video.title, video});
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", { pageTitle: "Video not Found."});
    }
    return res.render("edit", { pageTitle: `Editing ${video.title}`, video});
};
export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const videoExist = await Video.exists({ _id: id });
    if (!videoExist) {
        return res.render("404", { pageTitle: "Video not found." });
    }
    try {
        await Video.findByIdAndUpdate(id, {
            title, description,
            hashtags: Video.formatHashtags(hashtags),
        });
    } catch {
        return res.render("404", { pageTitle: "Edited video saving fail" });
    }
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/");
    } catch(error) {
        return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
    }
};


export const getDelete = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async(req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        });
    }
    return res.render("search", { pageTitle: "Search video", videos});
}

export const upload = (req, res) => res.send("upload video");
