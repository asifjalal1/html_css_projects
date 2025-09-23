import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// middleware
io.use((socket, next) => {
    console.log(socket.id)
    // condition to check if valid then run next method
    next()
})

io.on("connection", (socket) => {
    socket.on("send-count", (data) => {
        // send to all using including current user
        // io.emit("count", {
        //     id: socket.id,
        //     count: data
        // })

        // send to all using excluding current user
        // socket.broadcast.emit("count", {
        //     id: socket.id,
        //     count: data
        // })

        //  send to particular user/s (io/socket)
        socket.to(socket.id).emit("count", {
            id: socket.id,
            count: data
        })

        // join multiple users
        // data.rooms.forEach((room) => {
        //     socket.join(room)
        // })
        
        // socket.to(data.rooms).emit("count", {
        //     id: socket.id,
        //     count: data
        // })
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
    })
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
    