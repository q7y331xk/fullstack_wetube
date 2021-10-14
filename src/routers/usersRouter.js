import express  from "express";
import { profile, logout, edit, remove } from "../controllers/usersControllers";

const userRouter = express.Router();

// :id 가 아니라 /:id가 아닐까? 한번 해보자 나중에
userRouter.get("/:id", profile);
userRouter.get("/logout",logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);

export default userRouter;