import express  from "express";
import { watch, getEdit, postEdit, getDelete, postUpload, getUpload,  } from "../controllers/videosControllers";
import { privateOnlyMiddleware, videoUploads } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/upload")
    .all(privateOnlyMiddleware)
    .get(getUpload)
    .post(videoUploads.fields([
        { name: "video", maxCount: 1 },
        { name: "thumb", maxcount: 1 },
    ]),postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(privateOnlyMiddleware).get(getEdit).post(postEdit);
videoRouter
    .route("/:id([0-9a-f]{24})/delete")
    .all(privateOnlyMiddleware)
    .get(getDelete);

export default videoRouter;