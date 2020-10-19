const gameManager = require('../game/connect-4-game-holder.js');
const Game = require('../game/connect-4-game.js');
const fs = require('fs');
const Discord = require('discord.js');

class tournamentParticipant{
    constructor(id, player){
        this.seed = 0;
        this.player = player;
        this.id = player.id;
        this.spot = id;
        this.getStats();
    }

    getStats(){
        if (fs.existsSync('./assets/connect-4/game-record/' + this.id + '.dat')){
            var w = 0;
            var d = 0;
            var l = 0;
            var tot = 0;
            var playerGames = fs.readFileSync('./assets/connect-4/game-record/' + this.id + '.dat').toString().split('\n');
            for (var i = 0; i < playerGames.length - 1; i++) {
                switch (playerGames[i].charAt(0)) {
                    case 'W':
                        w++;
                        break;
                    case 'D':
                        d++;
                        break;
                    case 'L':
                        l++;
                }
                tot++;
            }
            this.lifetimeWR = 100.0 * w / tot;
            this.lifetimeGames = tot;
        }else{
            this.lifetimeWR = 50
            this.lifetimeGames = 0;
        }
    }
}

module.exports = {
    tournament: class{
        constructor(host, scope){
            this.players = [];
            this.allPlayers = [];
            this.round = 0;
            this.assisgnIndex = 0;
        };

        contains(player){
            for (var i = 0; i < this.players.length; i++)
                if (this.players[i].id == player.id)
                    return true;
            return false;
        };

        addPlayer(player){
            this.players.push(new tournamentParticipant(this.assisgnIndex++, player))
        };

        seedPlayers(){
            this.players.sort(function(first, second){
                if (first.lifetimeGames != second.lifetimeGames)
                    return first.lifetimeGames - second.lifetimeGames;
                if (first.lifetimeWR != second.lifetimeWR)
                    return first.lifetimeWR - second.lifetimeWR;
                return first.id - second.id;
            })
            this.players.reverse();
            for (var i = 0; i < this.players.length; i++){
                this.players[i].startingSeed = i;
                this.players[i].seed = i;
            }
        };

        createGames(){
            this.seedPlayers();
            this.createWithoutSeed();
        }

        createWithoutSeed(){
            if (this.players.length != this.getOptimalTourneySize(this.players.length)){
                for (var i = this.players.length - 1; i > this.getOptimalTourneySize(this.players.length); i--){
                    this.players[i].player.send("Here goes round #" + this.round);
                    this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)].player.send("Here goes round #" + this.round);
                    const game = new Game.connect4game(['<@' + this.players[i].id + '>', '<@' + this.players[this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)]].id + '>'], null)
                    game.setChannels([this.players[i].player.dmChannel, this.players[this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)]].player.dmChannel])
                    game.sysoutBoard(1);
                    game.lowerPlayer = this.players[i];
                    game.higherPlayer = this.players[this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)]];
                    game.tourney = this;
                    gameManager.addGame(game);
                    this.activeGames.push(game);
                }
                return;
            }
            this.activeGames = [];
            this.players.sort(function(first, second){
                return first.seed - second.seed;
            })
            for (var i = 0; i < this.players.length/2; i++){
                this.players[i].player.send("Here goes round #" + this.round);
                this.players[this.players.length - i - 1].player.send("Here goes round #" + this.round);
                const game = new Game.connect4game(['<@' + this.players[this.players.length - 1 - i].id + '>', '<@' + this.players[i].id + '>'], null)
                game.setChannels([this.players[this.players.length - 1 - i].player.dmChannel, this.players[i].player.dmChannel])
                game.sysoutBoard(1);
                game.lowerPlayer = this.players[i];
                game.higherPlayer = this.players[this.players.length - 1 - i];
                game.tourney = this;
                gameManager.addGame(game);
                this.activeGames.push(game);
            }
        };

        containsGame(game){
            for (var i = 0; i < this.activeGames.length; i++){
                if (this.activeGames[i].ID == game.ID)
                    return true;
            }
        }

        notifyGG(game){
            if (this.containsGame(game)){
                switch (game.gameOver(game.gameBoard)){
                    case 3:{
                        const newGame = new Game.connect4game(['<@' + game.lowerPlayer.id + '>', '<@' + game.upperPlayer.id + '>'], null)
                        newGame.setChannels([game.lowerPlayer.player.dmChannel, game.upperPlayer.player.dmChannel])
                        newGame.sysoutBoard(1);
                        newGame.lowerPlayer = game.upperPlayer;
                        newGame.upperPlayer = game.lowerPlayer;
                        newGame.tourney = this;
                        gameManager.addGame(newGame);
                        this.activeGames.push(newGame);
                        this.activeGames.splice(this.activeGames.indexOf(game), 1);
                        return;
                    }case 2:
                        console.log(this.players.length + " : " + game.higherPlayer.seed + " : " + game.lowerPlayer.seed)
                        game.lowerPlayer.player.send("You won")
                        game.higherPlayer.player.send("You lost")
                        this.players[this.players.indexOf(game.lowerPlayer)].seed = game.higherPlayer.seed
                        this.players.splice(this.players.indexOf(game.higherPlayer), 1)
                        break;
                    case 1:
                        console.log(this.players.length + " : " + game.higherPlayer.seed + " : " + game.lowerPlayer.seed)
                        game.higherPlayer.player.send("You won")
                        game.lowerPlayer.player.send("You lost")
                        this.players.splice(this.players.indexOf(game.lowerPlayer), 1)
                        break;
                    case 0:
                }
                this.activeGames.splice(this.activeGames.indexOf(game), 1);
                if (this.players.length == 1){
                    this.players[0].player.send("You won the whole thing")
                }else if (this.activeGames.length == 0)
                    this.createWithoutSeed();
            }
        }

        getOptimalTourneySize(n) { 
            if (n == 0) 
                return 0; 
    
            var msb = 0; 
            n = Math.floor(n / 2); 
    
            while (n != 0) { 
                n = Math.floor(n / 2); 
                msb++; 
            } 
    
            return (1 << msb); 
        } 
    }
}