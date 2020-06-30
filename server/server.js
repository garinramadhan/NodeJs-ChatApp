const path = require('path');
const http = require('http');
const express = require('express');
const socket = require('socket.io');

const publicPath = path.join(__dirname + "/../public/");
const port = process.env.port || 3000;

let app = express();
let server = http.createServer(app);
let io = socket(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New user connected");

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to ChatApp",
        createdAt: new Date().getTime()
    })

    socket.broadcast.emit('newMessage', {
        // from: "Admin",
        text: "New user joined!",
        createdAt: new Date().getTime()
    })
    
    socket.on('createMessage', (message) =>{
        console.log("createMessage", message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    })

    socket.on('disconnect', ()=>{
        console.log("User disconnected");
    });
});

server.listen(port, ()=>{
    console.log("Server listening on port " + port);
})