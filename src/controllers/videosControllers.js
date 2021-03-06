import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

const handleSearch = (error, videos) => {
    console.log("errors",error);
    console.log("videos", videos);
};

export const home = async(req, res) => {
    const videos = await Video.find({})
        .sort({ createdAt: "asc" })
        .populate("owner");
    return res.render("home", { pageTitle: "Home" , videos });
};
export const watch = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");
    if(!video) {
        return res.render("404", { pageTitle: "Video not Found."});
    }
    console.log("Hi");
    return res.render("watch", { pageTitle: video.title, video, });
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video) {
        return res.status(404).render("404", { pageTitle: "Video not Found."});
    }
    if (String(video.owner) !== req.session.user._id) {
        req.flash("error", "Get Edit Not Authorized");
        return res.status(403).redirect("/");
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
    } catch (error) {
        return res.status(404).render("404", { pageTitle: "Edited video saving fail" });
    }
    if (String(videoExist.owner) !== req.session.user._id) {
        return res.status(403).redirect("/");
    }
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
    return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
    const { user: { _id} } = req.session;
    console.log(req.files);
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    const isHeroku = process.env.NODE_ENV === "production"; 
    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: video[0] ? ( isHeroku ? video[0].location : video[0].path ) : "",
            thumbUrl: thumb[0] ? ( isHeroku ? thumb[0].location : thumb[0].path ) : "",
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
       return res.redirect("/");
    } catch(error) {
        return res.status(400).render("upload", { pageTitle: "Upload Video", errorMessage: error._message });
    }
};

export const getDelete = async (req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.render("404", { pageTitle: "Video not found." });
    }
    if (String(video.owner) !== req.session.user._id) {
        return res.status(403).redirect("/");
        
    }
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
        }).populate("owner");
    }
    return res.render("search", { pageTitle: "Search video", videos});
}

export const upload = (req, res) => res.send("upload video");

export const registerView = async(req, res) =>{
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
        return res.sendStatus(304);
    }
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
};

export const registerComment = async (req, res) => {
    const videoId = req.params.id;
    const text = req.body.text;
    const { session: { user }} = req;
    
    const video = await Video.findById(videoId);
    if (!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: videoId,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({ newCommentId: comment._id });
}