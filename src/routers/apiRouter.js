import express from "express";
import { registerView, registerComment } from "../controllers/videosControllers";

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", registerComment);



export default apiRouter;