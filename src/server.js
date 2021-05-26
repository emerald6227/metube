import express from "express";
// const express = require("express");

const app = express();
const PORT = 4000;

const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}

const protectionMiddleware = (req, res, next) => {
    const url = req.url;
    if (url === "/protected") {
        return res.send("<h1>Not Allowed</h1>");
    }
    console.log(`Allowed, you may continue`);
    next();
}

const handleHome = (req, res) => {
    return res.send("welcome home here.");
    // return res.end();
}

function loginFunc(req, res) {
    return res.send("This page is Login Page.");
}

app.use(logger);
app.use(protectionMiddleware);

app.get("/", handleHome);
app.get("/login", loginFunc);


const handleListening = () =>
    console.log(`Server listening on port ${PORT} 🚀`);

app.listen(PORT, handleListening);