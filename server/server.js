const express = require('express');
const http = require('http');
//const { Server } = require('socket.io');
// const cors = require('cors');

const app = express();

const server = http.createServer(app);
//const io = new Server(server);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST"]
    }
});

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // // Broadcast a message to all connected clients
    // socket.on('playerMove', (data) => {
    //     socket.broadcast.emit('playerMove', data);
    // });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    socket.on("test", (msg) => {
        console.log("ZE BLUETOOTH DEVICE HAS CONNECTED SUCSESFULLY " + msg);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
