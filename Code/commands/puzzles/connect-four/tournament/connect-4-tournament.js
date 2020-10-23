const fs = require('fs');
const Discord = require('discord.js');
const { error } = require('console');
const gameManager = require('../game/connect-4-game-holder.js');
const Game = require('../game/connect-4-game.js');
const Manager = require(process.cwd() + '/commands/puzzles/connect-four/tournament/connect-4-tournament-manager.js');

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
        constructor(host, scope, localServer){//Who owns it, global: true/local: false
            if (host == null){
                Manager.tournaments.splice(this, 1) 
                return;
            }
            this.players = [];
            this.allPlayers = [];
            this.round = 1;
            this.assisgnIndex = 0;
            this.inProgress = false;
            this.public = scope;
            this.hostServer = localServer;
            this.queued = false;
            this.owner = host;
        };

        delayedStart(tournament, errorChannel){
            if (tournament.players.length < 2){
                Manager.tournaments.splice(Manager.tournaments.indexOf(tournament), 1)
                errorChannel.send("Aborting tournament due to too few players!");
                return false;
            }
            tournament.createGames();
            tournament.inProgress = true;
            return true;
        }

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
            this.activeGames = [];
            this.players.sort(function(first, second){
                return first.seed - second.seed;
            })
            if (this.players.length != this.getOptimalTourneySize(this.players.length)){
                for (var i = this.players.length - 1; i > this.getOptimalTourneySize(this.players.length) - 1; i--){
                    this.players[i].player.send("Here goes round #" + this.round + '\nYou are going second, please wait');
                    this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)].player.send("Here goes round #" + this.round+ '\nYou are going first! please make your move');
                    const game = new Game.connect4game(['<@' + this.players[i].id + '>', '<@' + this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)].id + '>'], null)
                    game.timeout = 60000
                    game.timerObj = setTimeout(function (bruh, turn) {
                        bruh.channel[bruh.turn - 1].send("So sorry, but you took longer than " + bruh.timeout / 1000 + " seconds so you forfeit.")
                        bruh.ggMessage(turn)
                    }, game.timeout, game, game.turn - 1);
                    game.setChannels([this.players[i].player.dmChannel, this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)].player.dmChannel])
                    game.sysoutBoard(1);
                    game.lowerPlayer = this.players[i];
                    game.higherPlayer = this.players[2 * this.getOptimalTourneySize(this.players.length) - this.players.length + (this.players.length - 1 - i)];
                    game.tourney = this;
                    gameManager.addGame(game);
                    this.activeGames.push(game);
                }
                return;
            }
            for (var i = 0; i < this.players.length/2; i++){
                this.players[i].player.send("Here goes round #" + this.round + '\nYou are going first! please make your move');
                this.players[this.players.length - i - 1].player.send("Here goes round #" + this.round + '\nYou are going second, please wait');
                const game = new Game.connect4game(['<@' + this.players[this.players.length - 1 - i].id + '>', '<@' + this.players[i].id + '>'], null)
                game.timeout = 60000;
                game.timerObj = setTimeout(function (bruh, turn) {
                    bruh.channel[bruh.turn - 1].send("So sorry, but you took longer than " + bruh.timeout / 1000 + " seconds so you forfeit.")
                    bruh.ggMessage(turn)
                }, game.timeout, game, game.turn - 1);
                game.setChannels([this.players[this.players.length - 1 - i].player.dmChannel, this.players[i].player.dmChannel])
                game.sysoutBoard(1);
                game.higherPlayer = this.players[i];
                game.lowerPlayer = this.players[this.players.length - 1 - i];
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

        notifyGG(game, winner){
            if (this.containsGame(game)){
                switch (winner){
                    case 3:{
                        const newGame = new Game.connect4game(['<@' + game.lowerPlayer.id + '>', '<@' + game.upperPlayer.id + '>'], null)
                        game.timeout = 60000;
                        newGame.setChannels([game.lowerPlayer.player.dmChannel, game.upperPlayer.player.dmChannel])
                        newGame.sysoutBoard(1);
                        newGame.sysoutBoard(2);
                        newGame.lowerPlayer = game.upperPlayer;
                        newGame.upperPlayer = game.lowerPlayer;
                        newGame.tourney = this;
                        gameManager.addGame(newGame);
                        this.activeGames.push(newGame);
                        this.activeGames.splice(this.activeGames.indexOf(game), 1);
                        console.log("DRAW IN TOURNEY")
                        return;
                    }case 1:
                        console.log(winner  + " : " + game.lowerPlayer.id + " : " + game.higherPlayer.id)
                        this.players.splice(this.players.indexOf(game.higherPlayer), 1)
                        this.players[this.players.indexOf(game.lowerPlayer)].seed = game.higherPlayer.seed
                        game.lowerPlayer.player.send("You won")
                        game.higherPlayer.player.send("You lost")
                        if (!fs.existsSync('./assets/connect-4/tournaments/game-record/' + ("" + game.players[0]).substring(2, 20) + '.dat'))
                            fs.open('./assets/connect-4/tournaments/game-record/' + ("" + game.players[0]).substring(2, 20) + '.dat', function (err) { });
                        fs.appendFileSync('./assets/connect-4/tournaments/game-record/' + ("" + game.players[0]).substring(2, 20) + '.dat', "" + ((winner == 1 || winner == "1") ? "W" : (winner == 3 ? "D" : "L")) + ' ' + game.players[1] + '\n');
                        if (!fs.existsSync('assets/connect-4/tournaments/game-record/' + ("" + game.players[1]).substring(2, 20) + '.dat'))
                            fs.open('assets/connect-4/tournaments/game-record/' + ("" + game.players[1]).substring(2, 20) + '.dat', function (err) { });
                        fs.appendFileSync('assets/connect-4/tournaments/game-record/' + ("" + game.players[1]).substring(2, 20) + '.dat', "" + ((winner == 1 || winner == "1") ? "L" : (winner == 3 ? "D" : "W")) + ' ' + game.players[0] + '\n');
                        break;
                    case 2:
                        console.log(winner + " : " + game.higherPlayer.id + " : " + game.lowerPlayer.id)
                        game.higherPlayer.player.send("You won")
                        game.lowerPlayer.player.send("You lost")
                        this.players.splice(this.players.indexOf(game.lowerPlayer), 1)
                        if (!fs.existsSync('./assets/connect-4/tournaments/game-record/' + ("" + game.players[0]).substring(2, 20) + '.dat'))
                            fs.open('./assets/connect-4/tournaments/game-record/' + ("" + game.players[0]).substring(2, 20) + '.dat', function (err) { });
                        fs.appendFileSync('./assets/connect-4/tournaments/game-record/' + ("" + game.players[0]).substring(2, 20) + '.dat', "" + ((winner == 1 || winner == "1") ? "W" : (winner == 3 ? "D" : "L")) + ' ' + game.players[1] + '\n');
                        if (!fs.existsSync('assets/connect-4/tournaments/game-record/' + ("" + game.players[1]).substring(2, 20) + '.dat'))
                            fs.open('assets/connect-4/tournaments/game-record/' + ("" + game.players[1]).substring(2, 20) + '.dat', function (err) { });
                        fs.appendFileSync('assets/connect-4/tournaments/game-record/' + ("" + game.players[1]).substring(2, 20) + '.dat', "" + ((winner == 1 || winner == "1") ? "L" : (winner == 3 ? "D" : "W")) + ' ' + game.players[0] + '\n');                        
                        break;
                    case 0:
                }
                this.activeGames.splice(this.activeGames.indexOf(game), 1);
                if (this.players.length == 1){
                    this.players[0].player.send("You won the whole thing!!! U r the best around and finished 1st!")
                    Manager.tournaments.splice(Manager.tournaments.indexOf(this), 1)
                }else if (this.activeGames.length == 0){
                    this.round++;
                    this.createWithoutSeed();
                }
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