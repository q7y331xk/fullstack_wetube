import express  from "express";
import { userpage, logout, getEdit, postEdit, remove, startGithubLogin, finishGithubLogin,
    getChangePassword, postChangePassword } from "../controllers/usersControllers";
import { avatarUploads, privateOnlyMiddleware, publicOnlyMiddleware,
     } from "../middlewares";

const userRouter = express.Router();

userRouter.get("/logout", privateOnlyMiddleware, logout);
userRouter.route("/edit").all(privateOnlyMiddleware).get(getEdit).post(avatarUploads.single("avatar"),postEdit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/change-password").all(privateOnlyMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/:id", userpage);
export default userRouter;