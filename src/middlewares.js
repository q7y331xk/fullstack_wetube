import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);;
    res.locals.loggedInUser = req.session.user || {};
    return next();
};

export const privateOnlyMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Private Only Protector");
        return res.redirect("/login");
    }
}
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        req.flash("error", "Public Only Protector");
        return res.redirect("/");
    }
}
export const avatarUploads = multer({ 
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
 });
export const videoUploads = multer({ 
    dest: "uploads/videos/",
    limits: {
    fileSize: 10000000,
    },
});