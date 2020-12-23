const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const stream = require('stream');
const fs = require('fs');
const { platform } = require('os');
const { spawn } = require('child_process');

let cards;
let blankCard;
let bidIndicators;
let client;
let secondRound;
let lastBoard = new Map();

var prc;
var stdinStream;

let sysoutGame = function (channel, playerCards = ["", "", "", "", ""], board = ["", "", "", ""], bidDicators = ['4', '4', '4', '4'], score = ['0', '0', '0', '0', '0', '0'], message = "Empty Message") {
    const canvas = createCanvas(180, 226);
    const ctx = canvas.getContext('2d');
    //Player cards
    playerCards = playerCards.filter(card => card != "-1");
    for (var i = 0; i < playerCards.length; i++)
        if (playerCards[i] && playerCards[i] >= 0)
            ctx.drawImage(cards[Math.floor(parseInt(playerCards[i]) / 6)][parseInt(playerCards[i]) % 6], Math.floor(25 * (i + 0.5 * (5 - playerCards.length))) + 5, 130, 71, 96);
        /*else
            ctx.drawImage(blankCard, 25 * i + 35, 240, 71, 96);*/
    //bid squares:
    ctx.drawImage(bidIndicators[bidDicators[0]], 85 - 3, 64 + 3, Math.floor(21 / 2), Math.floor(22 / 2));
    ctx.drawImage(bidIndicators[bidDicators[1]], 70 - 3, 55 + 3, Math.floor(21 / 2), Math.floor(22 / 2));
    ctx.drawImage(bidIndicators[bidDicators[3]], 100 - 3, 55 + 3, Math.floor(21 / 2), Math.floor(22 / 2));
    ctx.drawImage(bidIndicators[bidDicators[2]], 85 - 3, 46 + 3, Math.floor(21 / 2), Math.floor(22 / 2));
    ctx.font = '14px Arial';
    ctx.fillStyle = '#66FFFF';
    ctx.fillText(`     G, P, T\nUs ${score[0]}, ${score[1]}, ${score[2]}`, 0, 12);
    ctx.fillText(`      G, P, T\n'Em ${score[3]}, ${score[4]}, ${score[5]}`, 110, 12);
    for (var i = 0; i < 4; i++) {
        if (board[i] <= 26)
            ctx.drawImage(cards[Math.floor(parseInt(board[i]) / 6)][parseInt(board[i]) % 6], 150 - 80 - Math.floor(50 * Math.sin(i * 0.5 * Math.PI)), 40 + Math.floor(41 * Math.cos(i * 0.5 * Math.PI)), Math.floor(71 / 2), Math.floor(96 / 2))
        else
            ctx.drawImage(secondRound[board[i] - 27], 150 - 80 - 50 * Math.sin(i * 0.5 * Math.PI), 40 + 41 * Math.cos(i * 0.5 * Math.PI), Math.floor(71 / 2), Math.floor(96 / 2))
    }

    const attachment = new MessageAttachment(canvas.toBuffer(), 'game.png');
    Promise.resolve(channel.send(message, attachment));
};

module.exports = {
    init(klient) {
        client = klient;

        if (!fs.existsSync(process.cwd() + '/assets/euchre/ConsoleApplication2.exe') || !platform().toString().toLowerCase().includes('win')) {
            console.log("Euchre bot not found or os not compatible");
            return;
        }

        stdinStream = new stream.Readable({
            read(size) {
                return true;
            }
        });

        prc = spawn(process.cwd() + '/assets/euchre/ConsoleApplication2');

        //prc.stdout.checkLoad = checkLoaded;

        prc.stdout.on('data', (data) => {
            var str = data.toString()
            str.replace(/(\r\n|\n|\r)/gm, "").trim();
        });

        prc.stderr.on('data', (data) => {
            console.error("Euchre master erred: " + data.toString());
            spawn('sendError.bat', ['Master euchre bot died', data.toString()]);
        });

        prc.on('exit', function (code) {
            console.log('Euchre master bot died with code ' + code);
        });

        stdinStream.pipe(prc.stdin);
        console.log("master euchre bot created");

        this.loadCards();
    },

    async loadCards() {
        blankCard = await loadImage('assets/images/square.png');

        cards = [
            [await loadImage('assets/images/Nhear.png'), await loadImage('assets/images/Tnhear.png'), await loadImage('assets/images/Jhear.png'), await loadImage('assets/images/Qhear.png'), await loadImage('assets/images/Khear.png'), await loadImage('assets/images/Ahear.png')],
            [await loadImage('assets/images/Ndia.png'), await loadImage('assets/images/Tndia.png'), await loadImage('assets/images/Jdia.png'), await loadImage('assets/images/Qdia.png'), await loadImage('assets/images/Kdia.png'), await loadImage('assets/images/Adia.png')],
            [await loadImage('assets/images/Nclubs.png'), await loadImage('assets/images/Tnclubs.png'), await loadImage('assets/images/Jclubs.png'), await loadImage('assets/images/Qclubs.png'), await loadImage('assets/images/Kclubs.png'), await loadImage('assets/images/Aclubs.png')],
            [await loadImage('assets/images/Nspa.png'), await loadImage('assets/images/Tnspa.png'), await loadImage('assets/images/Jspa.png'), await loadImage('assets/images/Qspa.png'), await loadImage('assets/images/Kspa.png'), await loadImage('assets/images/Aspa.png')],
            [await loadImage('assets/images/Square.png'), await loadImage('assets/images/Order.png'), await loadImage('assets/images/Pass.png')]
        ];

        cards[0].reverse();
        cards[1].reverse();
        cards[2].reverse();
        cards[3].reverse();

        secondRound = [await loadImage('assets/images/Heart.png'), await loadImage('assets/images/Diamon.png'), await loadImage('assets/images/Clubs.png'), await loadImage('assets/images/Spades.png'), await loadImage('assets/images/NoBid.png')]

        bidIndicators = [
            await loadImage('assets/images/bitmap33.png'), await loadImage('assets/images/bitmap34.png'), await loadImage('assets/images/bitmap35.png'), await loadImage('assets/images/bitmap36.png'), await loadImage('assets/images/bitmap37.png')
        ];
    },

    EuchreGame: class {
        players = [''];
        channels = new Map(); //player => channel

        constructor(playerIds = ['cpu', 'cpu', 'cpu', 'cpu']) {
            prc.stdout.on('data', this.handleComputer);
            for (var i = 0; i < 4; i++) {
                playerIds[i] = playerIds[i].replace('<', '').replace('@', '').replace('!', '').replace('>', '').replace('cpu', ' ');
            }
            this.players = playerIds;
            stdinStream.push(playerIds.join(',') + "\n");
        }

        shuffleDeck() {
            this.deck = [];
            var tempDeck = [];
            for (var i = 0; i < 24; i++) {
                tempDeck.push(i);
                this.playedCards[i] = false;
            }
            while (tempDeck.length > 0) {
                var randomCard = Math.floor(Math.random() * tempDeck.length);
                this.deck.push(tempDeck[randomCard]);
                tempDeck.splice(randomCard, 1);
            }
        }

        makeMove(move) {
            stdinStream.push(move + '\n');
        }

        handleComputer(data) {
            data = data.toString();
            this.tempData = [];
            data.split('\r\n').forEach(line => {
                if (line.includes("Enter") || line.length == 0)
                    return;
                console.log(line);
                this.tempData.push(line);
            });
            console.log(this.tempData);
            while (this.tempData.length > 0) {
                var data = this.tempData[0];
                const split = data.split(':');
                var uzer = client.users.cache.find(person => split[0] == person.id);
                if (!split.includes("Cards")) {
                    setTimeout((uzer, split) => uzer.send(split[1 + split.indexOf("Message")]).catch(console.log), 3000, uzer, split);
                } else {
                    sysoutGame(uzer, split[1 + split.indexOf("Cards")].split(','), split[1 + split.indexOf("Board")].split(','), split[1 + split.indexOf("Trump")].split(','), split[1 + split.indexOf("Score")].split(','), split.includes('Message') ? split[1 + split.indexOf("Message")] : "");//.catch(console.log);
                    lastBoard[split[0]] = data;
                }
                this.tempData.splice(0, 1);
            }
        }

        resendFor(userID) {
            if (lastBoard[userID] != undefined) {
                const split = lastBoard[userID].split(':');
                sysoutGame(client.users.cache.find(person => userID == person.id), split[1 + split.indexOf("Cards")].split(','), split[1 + split.indexOf("Board")].split(','), split[1 + split.indexOf("Trump")].split(','), split[1 + split.indexOf("Score")].split(','), split.includes('Message') ? split[1 + split.indexOf("Message")] : "");
            }
        }
    },


}