//example using socket.io
const { Socket } = require("dgram");
const express = require("express");
const http = require("http");
const {Server} = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

//Setup static folder
app.use(express.static("public"));
const users = new Set();

//Actual Socket.io application
io.on("connection",(socket)=>{
    console.log("A new user connected to the server.")

    socket.on("chat message", (msg)=>{
        console.log(`Message from ${socket.id}: ${msg}`);
        //Broadcast message to all connect clients
        io.emit("chat message", `${socket.username}: ${msg}`);
    })

    //Setr the username
    socket.on("set username", (username)=>{
        socket.username = username;
        users.add(username);
        socket.emit("user list", Array.from(users));
    });

    socket.on("disconnect",()=>{
        console.log("User disconnected:", socket.io);
        users.delete(socket.username);
        io.emit("user list", Array.from(users));
    })
})

server.listen(3000, ()=>{
    console.log("Server running on port 3000")
})