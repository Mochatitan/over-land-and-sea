const express = require('express');
const http = require('http');
const { Socket } = require('socket.io-client');
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

class Lobby {

    players = [];
    constructor(code, password) {
        this.code = code;
        this.password = password;
    }
}
class Player {

    constructor(name, id) {
        this.id = id;
        this.name = name;
    }
}

const players = [];
const lobbies = [];
lobbies.push(new Lobby("JKLM", "1234"));
console.log("lobbies: " + lobbies.length);

function getPlayerIndexByID(id) {
    players.forEach((player) => {
        if (player.id == id) {
            console.log("player matched ID " + id);
            return player;
        } else {
            console.log("Player ID mismatch");
        }
    });
}

app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    players.push(new Player("Mocha", socket.id));
    // // Broadcast a message to all connected clients
    // socket.on('playerMove', (data) => {
    //     socket.broadcast.emit('playerMove', data);
    // });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        players.splice(getPlayerIndexByID(socket.id), 1);
    });

    // socket.on("test", (msg) => {
    //     console.log("test status: " + msg);
    //     io.emit("test-two", "if you can read this the test worked");
    // });

    socket.on("join-lobby", (code) => {
        console.log("player " + socket.id + " attempt to log onto lobby " + code + ".");
        lobbies.forEach((lobby) => {
            if (code == lobby.code) {
                console.log("lobby code match.");
                lobby.players.push(socket.id);
                console.log(lobby.players);
            } else {
                console.log("lobby code mismatch.");
                console.log(code + " " + lobby.code);
            }
        });

        //io.emit("test-two", "if you can read this the test worked");
    });

});





server.listen(PORT, () => {
    console.log(`Server is running on http://127.0.0.1:${PORT}`);
});
