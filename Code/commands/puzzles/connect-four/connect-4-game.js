const { Console } = require('console');
const Discord = require('discord.js');
const stream = require('stream');
const Canvas = require('canvas');
const fs = require('fs');
const connect4GameHolder = require('./connect-4-game-holder');
const Commando = require('discord.js-commando');
const client = new Commando.CommandoClient();
const config = require(process.cwd() + '\\config.json');
client.login(config.token);

const emptyBoard = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0]];

const brainSize = 10000;

const { spawn } = require('child_process');

var prc;
var stdinStream;

var botLoaded = false;

function boardToString(board) {
    var out = "|";
    for (var i = 5; i >= 0; i--) {
        for (var j = 0; j < 7; j++) {
            out += "" + board[i][j];
        }
        out += "|";
    }
    return out;
}

function checkLoaded(str) {
    if (str.includes('INIT')) {
        thing();
        botLoaded = true;
        console.log('Roger, inited');
    }
}

function thing() {
    client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log);
}

module.exports = {
    botLoaded() {
        return botLoaded;
    },

    init() {
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
        });

        prc.on('exit', function (code) {
            console.log('Connect 4 master bot died with code ' + code);
        });
        stdinStream.pipe(prc.stdin);
        console.log("master bot created");
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
            this.channel = channel;
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

        acceptGame() {
            connect4GameHolder.makeLive(this);
            this.sysoutBoard(1);
        };

        declineGame() {
            connect4GameHolder.declineGame(this);
        };

        startGame() {
            /*this.prc = new Object();
            this.prc = Object.assign(this.prc, prc);
            this.players[1] = this.prc;
            console.log('Game started');
            function getInput(inputIn = "") {
                if (inputIn.length == 3)
                    this.makeMove(parseInt(inputIn.charAt(0)), parseInt(inputIn.charAt(2)));
            }
            this.prc.stdout.sendTo = this;
            this.prc.stdout.channel = this.channel;
            this.prc.stdout.listeningID = this.ID;
            this.prc.stderr.channel = this.channel;
            this.prc.onFail = this;
            function theThing(data) {
                var str = data.toString()
                str = str.replace(/(\r\n|\n|\r)/gm, "").trim();
                console.log("Connect 4 says: |" + str + "| and im listening for " + this.listeningID + ' ' + str.includes(this.listeningID));
                if (str.includes(this.listeningID))
                    this.sendTo.makeMove(parseInt(str.charAt(22)), 2);
            }
            this.prc.stdout.on('data', theThing);

            this.prc.stderr.on('data', (data) => {
                console.error(data.toString());
                this.channel.send("the connect four bot has encountered an exception " + data.toString())
            });

            /*this.prc.on('exit', function (code) {
                console.log('Connect 4 bot died with code ' + code);
            });*/
            //this.stdinStream.pipe(this.prc.stdin);
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
                for (var row = 0; row < 6; row++)
                    if (this.gameBoard[row][column] == 0) {
                        this.gameBoard[row][column] = playerNumber;
                        if (this.gameOver(this.gameBoard) != 0) {
                            if (this.gameOver(this.gameBoard) == 3)
                                this.ggMessage(3);
                            else
                                this.ggMessage(playerNumber);
                            return;
                        }
                        break;
                    }
                if (playerNumber == 1) {
                    if (this.isSinglePlayer)
                        stdinStream.push(this.ID + ':' + boardToString(this.gameBoard) + '\n');
                    else
                        this.sysoutBoard(playerNumber);
                    this.turn = 2;
                    this.turnNumber++;
                } else {
                    this.turn = 1;
                    this.sysoutBoard(0);
                }
            } else {
                if (this.isSinglePlayer) {
                    if (playerNumber == 1) {
                        this.channel.send("Hey dummy that column is full");
                    }
                } else {
                    this.channel.send("Hey dummy that column is full");
                }

            }
        };

        async sysoutBoard(player = this.turn - 1) {
            //console.log("board printing begin");
            const canvas = Canvas.createCanvas(224, 192);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('assets\\images\\defaultBoard.png');
            const redToken = await Canvas.loadImage('assets\\images\\redToken.png');
            const yellowToken = await Canvas.loadImage('assets\\images\\yellowToken.png');
            const whiteToken = await Canvas.loadImage('assets\\images\\whiteToken.png');
            const winningPeice = this.gameOver(this.gameBoard) == 1 ? await Canvas.loadImage('assets\\images\\winningYellowToken.png') : await Canvas.loadImage('assets\\images\\winningRedToken.png');
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            for (var row = 5; row >= 0; row--) {
                for (var col = 0; col < 7; col++) {
                    if (this.gameBoard[row][col] == 0)
                        ctx.drawImage(whiteToken, 32 * col, 160 - 32 * row, 32, 32);
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
            }
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'testBoard.png');
            if (this.lastMessage != null)
                this.lastMessage.delete().catch();
            if (!this.gameOver(this.gameBoard) && player != -1) {
                connect4GameHolder.holdMyBeer = this;
                this.channel.send('Don\'t mess up ' + this.players[player] + ' the i:b:iot', attachment)
                    .then(async function (message) {
                        if (connect4GameHolder.holdMyBeer == null)
                            return;
                        var effectiveThis = connect4GameHolder.holdMyBeer;
                        connect4GameHolder.holdMyBeer.lastMessage = message;
                        connect4GameHolder.holdMyBeer = null;
                        var thing = false;
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
                        }
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
                this.channel.send(attachment);
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
            for (var col = 0; col < 7; col++) {
                for (var row = 0; row < 6; row++) {
                    if (this.gameBoard[row][col] != 0)
                        return false;
                }
            }
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
                            }else if (board[row][col + boardExt] == winner && board[row + 1][col + boardExt] == winner && board[row + 2][col + boardExt] == winner && board[row + 3][col + boardExt] == winner)//vertical dub
                            {
                                this.windex = [row, col];
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
            console.log("Attempting to kill and remove. winner: " + winner);
            if (winner != 3) {
                if (this.isSinglePlayer) {
                    if (winner == 1 || winner == "1")
                        this.channel.send("Wow " + this.players[0] + " you should be so proud that you managed to beat a stupid program. Despite having played " + brainSize + " games your massive intelligence has won the day");
                    else
                        this.channel.send("Wow " + this.players[0] + " I honestly cannot believe that you lost. I mean, if you played " + brainSize + " games of connect-4 you might have won");
                } else {
                    if (winner == 1 || winner == "1")
                        this.channel.send("Wow " + this.players[0] + " completely dominated " + this.players[1] + " in only " + this.turnNumber + " moves");
                    else
                        this.channel.send("Wow " + this.players[1] + " completely dominated " + this.players[0] + " in only " + this.turnNumber + " moves");
                }
            } else {
                this.channel.send("Wow you both suck!");
            }
            this.sysoutBoard(-1);

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
            connect4GameHolder.removeGame(this);
        }
    }
}

