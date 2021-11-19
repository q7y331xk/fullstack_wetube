import express  from "express";
import { profile, logout, edit, remove, startGithubLogin, finishGithubLogin } from "../controllers/usersControllers";

const userRouter = express.Router();

userRouter.get("/logout",logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/:id", profile);

export default userRouter;