const { Console } = require('console');
const Discord = require('discord.js');
const stream = require('stream');
const Canvas = require('canvas');
const connect4GameHolder = require('./connect-4-game-holder');

const emptyBoard = [[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0]];

module.exports = {
    connect4game: class {
        brainSize = 10000;

        /*constructor(player1, player2, channel){
            this.isSinglePlayer = false;
            this.players.push(player1);
            this.players.push(player2);
            this.channel = channel;
            this.turn = 1;
            this.gameBoard = [[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]];
        }*/

        constructor(player1, channel) {
            console.log("creating new game for " + player1);
            this.isSinglePlayer = true;
            this.turnNumber = 0;
            this.players = [];
            this.players.push(player1);
            this.channel = channel;
            this.gameBoard = [[0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0]];

            this.stdinStream = new stream.Readable({
                read(size) {
                    return true;
                }
            });
        };

        acceptGame(){
            connect4GameHolder.makeLive(this);
        };

        declineGame(){

        };

        startGame() {
            const { spawn } = require('child_process');

            this.prc = spawn('java', ['-cp', process.cwd() + '\\connect-4-bot\\', 'ConnectFourMain', '' + this.brainSize]);
            this.players.push(this.prc);
            console.log('Game started');
            function getInput(inputIn = "") {
                if (inputIn.length == 3)
                    this.makeMove(parseInt(inputIn.charAt(0)), parseInt(inputIn.charAt(2)));
            }
            this.prc.stdout.sendTo = this;
            this.prc.stdout.channel = this.channel;
            this.prc.stderr.channel = this.channel;
            this.prc.onFail = this;
            function theThing(data) {
                var str = data.toString()
                str.replace(/(\r\n|\n|\r)/gm, "").trim();
                console.log("Connect 4 says: " + str);
                /*const ch = new Discord.MessageEmbed()
                    .setColor('#0cc0b4')
                    .setTitle('Connect 4 duel to the death')
                    .setDescription("Connect 4 says: " + str)
                    .setTimestamp()
                    .setFooter('Haha, good luck!');
                this.channel.send(ch);*/
                if (str.length <= 4)
                    this.sendTo.makeMove(parseInt(str.charAt(0)), 2);
            }
            this.prc.stdout.on('data', theThing);

            this.prc.stderr.on('data', (data) => {
                console.error(data.toString());
                this.channel.send("the connect four bot has encountered an exception " + data.toString())
            });

            this.prc.on('exit', function (code) {
                console.log('Connect 4 bot died with code ' + code);
                if ("" + code == "0")
                    this.onFail.gameOver(this.onFail.gameBoard);
            });
            this.stdinStream.pipe(this.prc.stdin);
        };

        makeMove(column = -1, playerNumber) {
            console.log("Incoming move! my owner is " + this.players[0] + " and they played " + column);
            if (this.hasRoom(column)) {
                for (var row = 0; row < 6; row++)
                    if (this.gameBoard[row][column] == 0) {
                        this.gameBoard[row][column] = playerNumber;
                        if (this.gameOver(this.gameBoard))
                            this.ggMessage(playerNumber);
                        break;
                    }
                if (playerNumber == 1){
                    this.stdinStream.push("" + column + '\n');
                    this.turnNumber++;
                }else{
                    this.sysoutBoard();
                }
            } else {

            }
        };

        async sysoutBoard() {
            console.log("board printing begin");
            const canvas = Canvas.createCanvas(224, 192);
            const ctx = canvas.getContext('2d');
            const background = await Canvas.loadImage('assets\\images\\defaultBoard.png');
            const redToken = await Canvas.loadImage('assets\\images\\redToken.png');
            const yellowToken = await Canvas.loadImage('assets\\images\\yellowToken.png');
            const whiteToken = await Canvas.loadImage('assets\\images\\whiteToken.png');
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
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'testBoard.png');
            this.channel.send('Don\'t mess up ' + this.players[0] + ' the i:b:iot', attachment);
            console.log("board printing done");
        };

        hasRoom(column) {
            return this.gameBoard[5][column] == 0;
        };

        isEmpty() {
            if (this.gameBoard === undefined){
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
                            if (board[row][col + boardExt] == winner && board[row][col + 1 + boardExt] == winner && board[row][col + 2 + boardExt] == winner && board[row][col + 3 + boardExt] == winner)//horizontal dub
                                return winner;
                        if (board[row][col] == winner && board[row + 1][col + 1] == winner && board[row + 2][col + 2] == winner && board[row + 3][col + 3] == winner)//diag positive slope
                            return winner;
                        if (board[row][col] == winner && board[row + 1][col] == winner && board[row + 2][col] == winner && board[row + 3][col] == winner)//vertical dub
                            return winner;
                        if (board[row + 3][col] == winner && board[row + 2][col + 1] == winner && board[row + 1][col + 2] == winner && board[row][col + 3] == winner)//diag negative slope
                            return winner;
                    }
                }
            }
            return 0;
        }

        ggMessage(winner) {
            console.log("Attempting to kill and remove. winner: " + winner);
            if (winner == 1 || winner == "1")
                this.channel.send("Wow " + this.players[0] + " you should be so proud that you managed to beat a stupid program. Despite having played " + this.brainSize + " games your massive intelligence has won the day");
            else
                this.channel.send("Wow " + this.players[0] + " I honestly cannot believe that you lost. I mean, if you played " + this.brainSize + " games of connect-4 you might have won");
            this.sysoutBoard();
            this.prc.kill();
            connect4GameHolder.removeGame(this);
            console.log("Attempted to kill and remove");
        }
    }
}

