import express  from "express";
import { recommended } from "../controllers/videosControllers";
import { join } from "../controllers/usersControllers";

const globalRouter = express.Router();

globalRouter.get("/", recommended);
globalRouter.get("/join", join)

export default globalRouter;