import multer from "multer";
import multers3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
    credentials: {
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET,
    },
});

const multerUploader = multers3({
    s3: s3,
    bucket: 'ductube',
    acl: 'public-read',
});

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
    storage: multerUploader,
 });
export const videoUploads = multer({ 
    dest: "uploads/videos/",
    limits: {
    fileSize: 10000000,
    },
    storage: multerUploader,
});