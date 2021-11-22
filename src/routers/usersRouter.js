import express  from "express";
import { profile, logout, getEdit, postEdit, remove, startGithubLogin, finishGithubLogin } from "../controllers/usersControllers";
import { privateOnlyMiddleware, publicOnlyMiddleware } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", privateOnlyMiddleware, logout);
userRouter.route("/edit").all(privateOnlyMiddleware).get(getEdit).post(postEdit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", profile);

export default userRouter;