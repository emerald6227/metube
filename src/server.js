import express from "express";
// const express = require("express");

const app = express();
const PORT = 4000;

const handleHome = (req, res) => {
    return res.send("welcome home here.");
    // return res.end();
}

const handleLogin = (req, res) => {
    return res.send({ message: "It is json message from login route"});
}

app.get("/", handleHome);
app.get("/login", handleLogin);


const handleListening = () =>
    console.log(`Server listening on port ${PORT}`);

app.listen(PORT, handleListening);