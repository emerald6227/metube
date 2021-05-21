import express from "express";

export const userRouter = express.Router(); // userRouter를 내보낼 수 있도록 설정

userRouter.get("/", (req, res) => res.send("user index"));
userRouter.get("/edit", (req, res) => res.send("user edit"));
userRouter.get("/password", (req, res) => res.send("user password")); 