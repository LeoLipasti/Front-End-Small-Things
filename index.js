const express = require("express");
const app = express();
const server = require("http").Server(app);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/connect4", (req, res) => {
    res.sendFile(__dirname + "/public/connectfour.html");
});

app.get("/github", (req, res) => {
    res.sendFile(__dirname + "/public/github.html");
});

app.get("/stickmen", (req, res) => {
    res.sendFile(__dirname + "/public/stickmen.html");
});

app.get("/stickman", (req, res) => {
    res.sendFile(__dirname + "/public/stickmen.html");
});

app.get("*", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(process.env.PORT || 8080, function() {
    console.log("Front End - Portfolio");
});
