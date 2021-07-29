import express from "express";
import { getEdit, postEdit, logout, seeProfile, startGithubLogin, finishGithubLogin, getChangePassword, postChangePassword, getDelete, postEditErrorHandler } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, avatarUpload } from '../middlewares';

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout)
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEditErrorHandler, postEdit);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.route("/delete").all(protectorMiddleware).get(getDelete);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", seeProfile);

export default userRouter;