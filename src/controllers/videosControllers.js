/*
const fakeUser = {
    username: "Nicolas",
    loggedIn: true,
}
*/ 
let videos = [
    {
        title: "First Vidoe",
        rating: 5,
        comments: 2,
        createdAt:  "2 minutes ago",
        views: 59,
        id: 1,
    },
    {
        title: "Second Vidoe",
        rating: 5,
        comments: 2,
        createdAt:  "2 minutes ago",
        views: 59,
        id: 2,
    },
    {
        title: "Third Vidoe",
        rating: 5,
        comments: 2,
        createdAt:  "2 minutes ago",
        views: 59,
        id: 3,
    },
];

export const recommended = (req, res) => res.render("home", { pageTitle: "Home", videos });
export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    return res.render("watch", { pageTitle: `Watching ${video.title}`});
}
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit Video"});
export const search = (req, res) => res.send("video search");
export const deleteVideo = (req, res) => res.send("delete video");
export const upload = (req, res) => res.send("upload video");