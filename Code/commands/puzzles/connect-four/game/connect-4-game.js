const { Console } = require('console');
const Discord = require('discord.js');
const stream = require('stream');
const Canvas = require('canvas');
const fs = require('fs');
const connect4GameHolder = require('./connect-4-game-holder');
const Commando = require('discord.js-commando');
const config = require(process.cwd() + '\\config.json');

const { spawn } = require('child_process');

let client;
let background;
let blankBoard;
let redToken;
let yellowToken;
let lastRedToken;
let lastYellowToken;
let winningYellowToken;
let winningRedToken;

const emptyBoard = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0]];

const brainSize = 0;

var prc;
var stdinStream;
var gamesPlayed = 0;

var botLoaded = false;

function boardToString(board) {// DEBUG ONLY
    var out = "|";
    for (var i = 5; i >= 0; i--) {
        for (var j = 0; j < 7; j++) {
            out += "" + board[i][j];
        }
        out += "|";
    }
    return out;
}

function checkLoaded(str = "") {// pass data in here to see if the bot is declaring itself loaded
    if (str.includes('INIT')) {
        thing();
        botLoaded = true;
        console.log('Roger, inited');
        return;
    }
}

function thing() {
    if (client.user != null)
        client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log);
    else {
        client.login(config.token).then(() => client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log)).catch(() => console.log("an error occured while setting presence"));
    }
}

module.exports = {
    setClient(klient) {
        client = klient;
    },

    async initImages() {
        background = await Canvas.loadImage('assets\\images\\defaultBoard.png');
        blankBoard = await Canvas.loadImage('assets\\images\\emptyBoard.png');
        redToken = await Canvas.loadImage('assets\\images\\redToken.png');
        yellowToken = await Canvas.loadImage('assets\\images\\yellowToken.png');
        lastRedToken = await Canvas.loadImage('assets\\images\\lastRedToken.png');
        lastYellowToken = await Canvas.loadImage('assets\\images\\lastYellowToken.png');
        winningYellowToken = await Canvas.loadImage('assets\\images\\winningYellowToken.png');
        winningRedToken = await Canvas.loadImage('assets\\images\\winningRedToken.png');
    },

    gamesPlayed() {
        return gamesPlayed;
    },

    botLoaded() {
        return botLoaded;
    },

    brainSize() {
        return brainSize;
    },

    init() {
        connect4GameHolder.gamesPlayed = fs.readFileSync(process.cwd() + '/assets/connect-4/game-record/0_computerBrain.dat').toString().split('\n').length - 1;

        stdinStream = new stream.Readable({
            read(size) {
                return true;
            }
        });

        prc = spawn('java', ['-Xms4g', '-cp', process.cwd() + '\\connect-4-bot\\', 'ConnectFourMain', '' + brainSize]);

        prc.stdout.checkLoad = checkLoaded;

        function theThing(data) {
            var str = data.toString()
            str.replace(/(\r\n|\n|\r)/gm, "").trim();
            //console.log("Connect 4 master says: " + str);
            this.checkLoad(str);
            connect4GameHolder.notifyData(str);
        }
        prc.stdout.on('data', theThing);

        prc.stderr.on('data', (data) => {
            console.error("Connect 4 master erred: " + data.toString());
            spawn('sendError.bat', ['C4 bot died', data.toString()]);
            //process.exit(-1);
            process.exit(2); //just in case -1 doesnt work for some unforseen reason
        });

        prc.on('exit', function (code) {
            console.log('Connect 4 master bot died with code ' + code);
        });

        stdinStream.pipe(prc.stdin);
        console.log("master c4 bot created");

        this.initImages();
    },

    connect4game: class {
        constructor(player1, channel) {
            if (player1[1] != null) {
                this.isSinglePlayer = false;
            } else {
                console.log("creating new game for " + player1[0]);
                this.isSinglePlayer = true;
            }
            this.generateID();
            this.turn = 2;
            this.players = player1;
            this.turnNumber = 1;
            this.channel = [channel, channel];
            this.gameBoard = [[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]];
        };

        generateID() {
            this.ID = "";
            for (var i = 0; i < 20; i++) {
                this.ID += Math.floor(Math.random() * 10);
            }
        };

        setChannels(channels) {
            this.channel[0] = channels[0];
            this.channel[1] = channels[1];
        }

        acceptGame(channel) {
            connect4GameHolder.makeLive(this);
            this.channel[1] = channel;
            this.sysoutBoard(1);
        };

        declineGame() {
            connect4GameHolder.declineGame(this);
        };

        makeInitialSend() {
            stdinStream.push(this.ID + ':' + boardToString(this.gameBoard) + '\n');
        }

        makeMove(column = -1, playerNumber) {
            //console.log("Incoming move! my owner is " + this.players[0] + " and they played " + column);
            if (this.turn != playerNumber) {
                //console.log("Rejecting out of turn data");
                return;
            }
            if (this.hasRoom(column)) {
                this.lastMove = column;
                for (var row = 0; row < 6; row++)
                    if (this.gameBoard[row][column] == 0) {
                        this.gameBoard[row][column] = playerNumber;
                        if (this.gameOver(this.gameBoard) != 0) {
                            if (this.gameOver(this.gameBoard) == 3)
                                this.ggMessage(3);
                            else
                                this.ggMessage(playerNumber);
                            stdinStream.push(this.ID + ':' + boardToString(this.gameBoard) + '\n');
                            return;
                        }
                        break;
                    }
                if (playerNumber == 1) {
                    this.turn = 2;
                    if (this.isSinglePlayer)
                        stdinStream.push(this.ID + ':' + boardToString(this.gameBoard) + '\n');
                    else
                        this.sysoutBoard(playerNumber);
                    this.turnNumber++;
                } else {
                    this.turn = 1;
                    this.sysoutBoard(0);
                }
                if (this.timerObj != undefined)
                    clearTimeout(this.timerObj);
                if (this.timeout != 0) {
                    let timeout = this.timeout;
                    this.timerObj = setTimeout(function (bruh, turn) {
                        bruh.channel[bruh.turn - 1].send("So sorry, but you took longer than " + timeout / 1000 + " seconds so you forfeit.");
                        bruh.ggMessage(turn);
                    }, timeout, this, this.turn == 2 ? 1 : 2);
                }
            } else {
                if (this.isSinglePlayer) {// DEPRICATED from =m
                    if (playerNumber == 1) {
                        this.channel[this.turn - 1].send("Hey dummy that column is full");
                    }
                } else {
                    this.channel[this.turn - 1].send("Hey dummy that column is full");
                }

            }
        };

        sysoutBoard(player = this.turn - 1) {
            //console.log("board printing begin");
            const canvas = Canvas.createCanvas(224, 192);
            const ctx = canvas.getContext('2d');
            const winningPeice = this.gameOver(this.gameBoard) == 1 ? winningYellowToken : winningRedToken;
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            ctx.drawImage(blankBoard, 0, 0, canvas.width, canvas.height);
            for (var col = 0; col < 7; col++) {
                for (var row = 0; row < 6; row++) {
                    if (this.gameBoard[row][col] == 0)
                        break;
                    if (this.gameBoard[row][col] == 1)
                        ctx.drawImage(yellowToken, 32 * col, 160 - 32 * row, 32, 32);
                    if (this.gameBoard[row][col] == 2)
                        ctx.drawImage(redToken, 32 * col, 160 - 32 * row, 32, 32);
                }
            }
            if (this.gameOver(this.gameBoard) != 0) {
                for (var i = 0; i < 4; i++) {
                    switch (this.winstyle) {
                        case 1:
                            ctx.drawImage(winningPeice, 32 * (this.windex[1] + i), 160 - 32 * this.windex[0], 32, 32)
                            break;
                        case 2:
                            ctx.drawImage(winningPeice, 32 * (this.windex[1] + i), 160 - 32 * (this.windex[0] + i), 32, 32)
                            break;
                        case 3:
                            ctx.drawImage(winningPeice, 32 * this.windex[1], 160 - 32 * (this.windex[0] + i), 32, 32)
                            break;
                        case 4:
                            ctx.drawImage(winningPeice, 32 * (this.windex[1] + i), 160 - 32 * (this.windex[0] + 3 - i), 32, 32)
                    }
                }
            } else if (this.lastMove != undefined) {
                var lastSpot = -1;
                for (row = 5; row >= 0; row--)
                    if (this.gameBoard[row][this.lastMove] != 0) {
                        lastSpot = row;
                        break;
                    }
                ctx.drawImage((this.turn == 1 ? lastRedToken : lastYellowToken), 32 * this.lastMove, 160 - 32 * lastSpot, 32, 32);
            }
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'testBoard.png');
            if (this.lastMessage != null && this.lastMessage.channel.guild != null)
                this.lastMessage.delete().catch();
            if (!this.gameOver(this.gameBoard) && player != -1) {
                connect4GameHolder.holdMyBeer = this;
                this.channel[player].send('Don\'t mess up ' + this.players[player] + ' the i:b:iot! You are playing the ' + (this.turn == 1 ? "yellow" : "red") + " pieces", attachment)
                    .then(async function (message) {
                        if (connect4GameHolder.holdMyBeer == null)
                            return;
                        var effectiveThis = connect4GameHolder.holdMyBeer;
                        connect4GameHolder.holdMyBeer.lastMessage = message;
                        connect4GameHolder.holdMyBeer = null;
                        //DEPRICATED from playing by reaction
                        /*var thing = false;
                        while (!thing) {
                            try {
                                if (effectiveThis.hasRoom(0))
                                    await message.react('1️⃣').catch();
                                if (effectiveThis.hasRoom(1))
                                    await message.react('2️⃣').catch();
                                if (effectiveThis.hasRoom(2))
                                    await message.react('3️⃣').catch();
                                if (effectiveThis.hasRoom(3))
                                    await message.react('4️⃣').catch();
                                if (effectiveThis.hasRoom(4))
                                    await message.react('5️⃣').catch();
                                if (effectiveThis.hasRoom(5))
                                    await message.react('6️⃣').catch();
                                if (effectiveThis.hasRoom(6))
                                    await message.react('7️⃣').catch();
                                thing = true;
                            } catch (error) {
                                //console.error('One of the emojis failed to react. ' + message.deleted);
                                thing = message.deleted;
                            }
                        }*/
                        //Still allow play by reaction
                        const filter = (reaction, user) => {
                            return '<@' + user.id + '>' == effectiveThis.players[effectiveThis.turn - 1] && ((reaction.emoji.name == '1️⃣' && effectiveThis.hasRoom(0)) || (reaction.emoji.name == '2️⃣' && effectiveThis.hasRoom(0)) || (reaction.emoji.name == '3️⃣' && effectiveThis.hasRoom(0)) || (reaction.emoji.name == '4️⃣' && effectiveThis.hasRoom(0)) || (reaction.emoji.name == '5️⃣' && effectiveThis.hasRoom(0)) || (reaction.emoji.name == '6️⃣' && effectiveThis.hasRoom(0)) || (reaction.emoji.name == '7️⃣' && effectiveThis.hasRoom(0)));
                        };

                        const collector = message.createReactionCollector(filter);
                        collector.on.effectiveThis = effectiveThis;
                        collector.on('collect', (reaction, reactionCollector) => {
                            var react;
                            switch (reaction.emoji.name) {
                                case '1️⃣':
                                    react = 1;
                                    break;
                                case '2️⃣':
                                    react = 2;
                                    break;
                                case '3️⃣':
                                    react = 3;
                                    break;
                                case '4️⃣':
                                    react = 4;
                                    break;
                                case '5️⃣':
                                    react = 5;
                                    break;
                                case '6️⃣':
                                    react = 6;
                                    break;
                                case '7️⃣':
                                    react = 7;
                                    break;
                            }
                            if (connect4GameHolder.notifyData((react - 1) + ' ' + effectiveThis.ID))
                                message.delete().catch();
                        });
                    }).catch();
            } else {
                this.channel[0].send(attachment);
                if (this.channel[0].id != this.channel[1].id)
                    this.channel[1].send(attachment);
            }
            //console.log("board printing done");
        };

        hasRoom(column) {
            return this.gameBoard[5][column] == 0;
        };

        isEmpty() {
            if (this.gameBoard === undefined) {
                console.log(this.players[0] + " was undefined");
                return true;
            }
            for (var col = 0; col < 7; col++)
                for (var row = 0; row < 6; row++)
                    if (this.gameBoard[row][col] != 0)
                        return false;
            return true;
        };

        gameOver(board) {
            for (var winner = 1; winner <= 2; winner++) {
                for (var col = 0; col < 4; col++) {
                    for (var row = 0; row < 3; row++) {
                        for (var boardExt = 0; boardExt < 4; boardExt++)
                            if (board[row + boardExt][col] == winner && board[row + boardExt][col + 1] == winner && board[row + boardExt][col + 2] == winner && board[row + boardExt][col + 3] == winner)//horizontal dub
                            {
                                this.windex = [row + boardExt, col];
                                this.winstyle = 1;
                                return winner;
                            } else if (board[row][col + boardExt] == winner && board[row + 1][col + boardExt] == winner && board[row + 2][col + boardExt] == winner && board[row + 3][col + boardExt] == winner)//vertical dub
                            {
                                this.windex = [row, col + boardExt];
                                this.winstyle = 3;
                                return winner;
                            }
                        if (board[row][col] == winner && board[row + 1][col + 1] == winner && board[row + 2][col + 2] == winner && board[row + 3][col + 3] == winner)//diag positive slope
                        {
                            this.windex = [row, col];
                            this.winstyle = 2;
                            return winner;
                        } else if (board[row + 3][col] == winner && board[row + 2][col + 1] == winner && board[row + 1][col + 2] == winner && board[row][col + 3] == winner)//diag negative slope
                        {
                            this.windex = [row, col];
                            this.winstyle = 4;
                            return winner;
                        }
                    }
                }
            }
            var allFilled = true;
            for (var col = 0; col < 7; col++) {
                if (board[5][col] == 0)
                    return 0;
            }
            return 3;
        }

        ggMessage(winner) {
            clearTimeout(this.timerObj);
            console.log("Winner: " + winner);
            spawn('sendNotification.bat', ['GG m8', (this.players[0] + ' ' + (winner == 1 ? 'won' : winner == 3 ? 'drew' : 'lost') + ' to ' + (this.isSinglePlayer ? ' the cpu' : this.players[1])).replace('\"', '').replace('\'', '')])
            if (winner != 3) {
                if (this.isSinglePlayer) {
                    var streakMessage = "";
                    if (!fs.existsSync('./assets/connect-4/game-record/' + this.players[0].substring(2, 20) + '.dat')) {
                        if (winner == 1 || winner == "1")
                            streakMessage = "I cant find any games that you have played against me, so congrats on your first dub";
                        else
                            streakMessage = "I cant find any games that you have played against me, so better luck next time";
                    } else {
                        var playerGames = fs.readFileSync('./assets/connect-4/game-record/' + this.players[0].substring(2, 20) + '.dat').toString().split('\n');
                        var winningOrLosing;
                        var botStreak = 0;
                        for (var i = playerGames.length - 2; i >= 0; i--) {
                            if (playerGames[i].substring(2).length > 9)
                                continue;
                            if (winningOrLosing == undefined)
                                winningOrLosing = playerGames[i].substring(0, 1);
                            if (playerGames[i].substring(0, 1) != winningOrLosing)
                                break;
                            botStreak++;
                        }
                        if (winningOrLosing == "D"){
                        }else if ((winningOrLosing == "W") == (winner == 1)){
                            streakMessage = "Your streak is getting longer! ";
                            botStreak++;
                            if (winningOrLosing == "W")
                                streakMessage += "You now have " + botStreak + " wins in a row!";
                            if (winningOrLosing == "L")
                                streakMessage += "You now have " + botStreak + " losses in a row :/";
                        }else{
                            streakMessage = "Your " + botStreak + " game " + (winningOrLosing == "L" ? "losing" : "winning") + " streak has come to an end"
                        }
                    }
                    if (winner == 1 || winner == "1") {
                        this.channel[0].send("Wow " + this.players[0] + " you should be so proud that you managed to beat a stupid program. Despite having played " + connect4GameHolder.notgamesPlayed() + " games your massive intelligence has won the day.\n" + streakMessage );
                    } else {
                        this.channel[0].send("Wow " + this.players[0] + " I honestly cannot believe that you lost. I mean, if you played " + connect4GameHolder.notgamesPlayed() + " games of connect-4 you might have won.\n" + streakMessage);
                    }
                } else {
                    if (winner == 1 || winner == "1") {
                        this.channel[0].send("Wow " + this.players[0] + " completely dominated " + this.players[1] + " in only " + this.turnNumber + " moves");
                        if (this.channel[0].id != this.channel[1].id)
                            this.channel[1].send("Wow " + this.players[0] + " completely dominated " + this.players[1] + " in only " + this.turnNumber + " moves");
                    } else {
                        this.channel[0].send("Wow " + this.players[1] + " completely dominated " + this.players[0] + " in only " + this.turnNumber + " moves");
                        if (this.channel[0].id != this.channel[1].id)
                            this.channel[1].send("Wow " + this.players[1] + " completely dominated " + this.players[0] + " in only " + this.turnNumber + " moves");
                    }
                }
            } else {
                if (this.isSinglePlayer)
                    this.channel[0].send("Wow we both suck!");
                else {
                    this.channel[0].send("Wow you both suck!");
                    if (this.channel[0] != this.channel[1])
                        this.channel[1].send("Wow you both suck!");
                }
            }
            this.sysoutBoard(-1);

            if (this.gameOver(this.gameBoard) != 0)
                connect4GameHolder.gamesPlayed++;
            if (this.tourney == undefined) {
                if (!fs.existsSync('./assets/connect-4/game-record/' + ("" + this.players[0]).substring(2, 20) + '.dat'))
                    fs.open('./assets/connect-4/game-record/' + ("" + this.players[0]).substring(2, 20) + '.dat', function (err) { });
                fs.appendFileSync('./assets/connect-4/game-record/' + ("" + this.players[0]).substring(2, 20) + '.dat', "" + ((winner == 1 || winner == "1") ? "W" : winner == 3 ? "D" : "L") + ' ' + (this.isSinglePlayer ? brainSize : this.players[1]) + '\n');
                if (!this.isSinglePlayer) {
                    if (!fs.existsSync('assets/connect-4/game-record/' + ("" + this.players[1]).substring(2, 20) + '.dat'))
                        fs.open('assets/connect-4/game-record/' + ("" + this.players[1]).substring(2, 20) + '.dat', function (err) { });
                    fs.appendFileSync('assets/connect-4/game-record/' + ("" + this.players[1]).substring(2, 20) + '.dat', "" + ((winner == 1 || winner == "1") ? "L" : winner == 3 ? "D" : "W") + ' ' + this.players[0] + '\n');
                } else {
                    if (!fs.existsSync('assets/connect-4/game-record/' + brainSize + '_computerBrain.dat'))
                        fs.open('assets/connect-4/game-record/' + brainSize + '_computerBrain.dat', function (err) { });
                    fs.appendFileSync('assets/connect-4/game-record/' + brainSize + '_computerBrain.dat', "" + ((winner == 1 || winner == "1") ? "L" : winner == 3 ? "D" : "W") + ' ' + this.players[0] + '\n');
                }
            } else {
                console.log("its over in this tourney");
                this.tourney.notifyGG(this, /*this.gameOver(this.gameBoard) == 0 ? winner + 1 :*/ winner);
            }
            connect4GameHolder.removeGame(this);
        }
    }
}
