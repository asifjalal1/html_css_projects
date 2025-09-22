
const express = require("express");

const path = require("path");

const app = express();

const http = require("http");

const server = http.createServer(app);

const io = require("socket.io")(server);

const port = 3000;

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
    socket.on("sendLocation", (location) => {
        io.emit("receiveLocation", {id: socket.id, ...location});
    });
    socket.on("disconnect", () => {
        io.emit("disconnect-user", {id: socket.id});
    });
});

app.get("/", (req, res) => {
    res.render("index");
});


server.listen(port, () => {
    console.log(`listening on *:${port}`);
});
 