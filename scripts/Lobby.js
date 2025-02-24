export class Lobby {

    players = [];
    constructor(code, password, players) {
        this.code = code;
        this.password = password;
        this.players = players;
    }

    printPlayers() {
        this.players.forEach((player) => {
            console.log(player.name);
        });
    }


}