import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// console.log(process.cwd());

const app = express();
const PORT = 4000;

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

// app.get("/", handleHome);

const handleListening = () =>
    console.log(`Server listening on port ${PORT} 🚀`);

app.listen(PORT, handleListening);