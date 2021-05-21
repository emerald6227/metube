import express from "express"; // express 프레임워크를 사용할 수 있도록 import 아래와 동일
// const express = require('express'); // require: 프로젝트 내에서 node module을 가져온다.
import morgan from "morgan"; // morgan은 Logging을 도와주는 미들웨어
import helmet from "helmet"; // 보안을 위한 express 미들웨어
import cookieParser from "cookie-parser"; // 
import bodyParser from "body-parser"; // req Object에 있는 body내용을 다룰 수 있게해주는 미들웨어
import { userRouter } from "./router"; // default export를 하지 않으면 이렇게 import 해줘야한다. (예시로 default 사용 X)

const app = express();

// const PORT = 4000;
// function handleListening() {
//     console.log(`Listening on: http://localhost:${PORT}`);
// }


function handleHome(req, res) {
    // console.log(req);
    res.send(`Hello from home!`);
}

// ES6 Arrow function 사용
const handleProfile = (req, res) => res.send(`You are on my Profile`);

const betweenHome = (req, res, next) => {
    // 미들웨어 안에서 res.send를 사용하면 연결을 끊을 수 있음.
    console.log(`I'm between`);
    next();
}


app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true }));
app.use(helmet());
app.use(morgan("dev"));

// home을 요청
app.get("/", betweenHome, handleHome);

app.get("/profile", handleProfile);

// Router 사용
app.use("/user", userRouter); // '/user' 경로에 접속하면 userRouter Object 안에있는 "/"로 된 기본 index에 접근한다.
// userRouter 안에 있는 '/edit'에 접속하고싶다면, '/user/edit'로 접속하면 된다.

// app.listen(PORT, handleListening);

export default app; // 다른 스크립트에서 app.js를 import하면 app object를 반환한다.