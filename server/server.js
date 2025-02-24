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

    printPlayers() {
        players.forEach((player) => {
            console.log(player.name);
        });
    }

    emit(io, signal, variable) {
        io.to(this.code).emit(signal, variable);
    }
}
class Player {
    lobby = "none";
    name = "delta 1-1";
    index = 192;
    constructor(name, id) {
        console.log("lengt: " + players.length);
        this.index = players.length;
        this.id = id;
        this.name = name;
    }
}

const players = [];
const lobbies = [];
lobbies.push(new Lobby("JKLM", "1234"));
console.log("lobbies: " + lobbies.length);

function getPlayerIndexByID(id) {
    for (let player of players) {
        if (player.id == id) {
            console.log("player matched ID " + id);
            console.log("indicks: " + player.index);
            return player.index; // ✅ This exits the function properly
        } else {
            console.log("Player ID mismatch");
        }
    }
    return -1; // Or another default value if player not found
}
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
        players.splice(getPlayerIndexByID(socket.id), 1);
    });

    // socket.on("test", (msg) => {
    //     console.log("test status: " + msg);
    //     io.emit("test-two", "if you can read this the test worked");
    // });

    socket.on("join-lobby", (code, name) => {
        players.push(new Player(name, socket.id));
        let index = getPlayerIndexByID(socket.id);
        console.log("index: " + index);
        var playerJoining = players[index];

        console.log("player " + playerJoining.name + " attempt to log onto lobby " + code + ".");
        lobbies.forEach((lobby) => {
            if (code == lobby.code) {
                console.log("lobby code match.");
                lobby.players.push(playerJoining);
                playerJoining.lobby = lobby.code;
                socket.join(lobby.code);
                lobby.printPlayers();
                //io.to("JKLM").emit("test-room", "skib");
                lobby.emit(io, "test-room", "skib");
                io.emit("suckies-join", {
                    code: lobby.code,
                    password: lobby.password,
                    players: lobby.players.map(player => ({ name: player.name, id: player.id, index: player.index })) // Send as plain objects,
                });
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
