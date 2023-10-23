import express from "express";

import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
// const server = createServer(app);
// const io = new Socket(server, {
//     cors: { origin: "http://localhost:8000" },
// });

// Enable CORS for all routes
// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:8000");
//     // You can use a wildcard to allow any origin: '*'
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//     res.header("Access-Control-Allow-Headers", "Content-Type");
//     next();
// });

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://127.0.0.1:8000", "http://localhost:8000"],
        // // or with an array of origins
        // // origin: ["https://my-frontend.com", "https://my-other-frontend.com", "http://localhost:3000"],
        // credentials: true,
    },
});

io.on("connection", (socket) => {
    console.log("Client connected");

    socket.on("chat:send", (message) => {
        io.emit("chat:receive", message);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
