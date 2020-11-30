const Discord = require('discord.js');
const Canvas = require('canvas');
const stream = require('stream');
const { spawn } = require('child_process');

let cards;
let blankCard;
let bidIndicators;
let client;
let secondRound;

var prc;
var stdinStream;

let sysoutGame = function (channel, playerCards = ["", "", "", "", ""], board = ["", "", "", ""], bidDicators = ['4', '4', '4', '4'], score = ['0', '0', '0', '0', '0', '0'], message = "Empty Message") {
    const canvas = Canvas.createCanvas(282, 366);
    const ctx = canvas.getContext('2d');
    //Player cards
    for (var i = 0; i < 5; i++) {
        if (playerCards[i] && playerCards[i] >= 0)
            ctx.drawImage(cards[Math.floor(parseInt(playerCards[i]) / 6)][parseInt(playerCards[i]) % 6], 25 * i + 75, 270, 71, 96);
        else
            ctx.drawImage(blankCard, 25 * i + 75, 270, 71, 96);
    }
    //bid squares:
    ctx.drawImage(bidIndicators[bidDicators[0]], 150, 140 + 0, 21, 22);
    ctx.drawImage(bidIndicators[bidDicators[1]], 125, 125 + 0, 21, 22);
    ctx.drawImage(bidIndicators[bidDicators[3]], 175, 125 + 0, 21, 22);
    ctx.drawImage(bidIndicators[bidDicators[2]], 150, 110 + 0, 21, 22);
    ctx.font = '20px Arial';
    ctx.fillStyle = '#66FFFF';
    ctx.fillText(`         G, P, T\nUs:     ${score[0]}, ${score[1]}, ${score[2]}\nThem: ${score[3]}, ${score[4]}, ${score[5]}`, 0, 20);
    for (var i = 0; i < 4; i++) {
        if (board[i] <= 26)
            ctx.drawImage(cards[Math.floor(parseInt(board[i]) / 6)][parseInt(board[i]) % 6], 150 - 19 - 80 * Math.sin(i * 0.5 * Math.PI), 90 + 80 * Math.cos(i * 0.5 * Math.PI))
        else
            ctx.drawImage(secondRound[board[i] - 27], 150 - 19 - 80 * Math.sin(i * 0.5 * Math.PI), 90 + 80 * Math.cos(i * 0.5 * Math.PI))
    }

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'game.png');
    channel.send(message, attachment);
}

module.exports = {
    init(klient) {
        client = klient;
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
        blankCard = await Canvas.loadImage('assets/images/square.png');

        cards = [
            [await Canvas.loadImage('assets/images/Nhear.png'), await Canvas.loadImage('assets/images/Tnhear.png'), await Canvas.loadImage('assets/images/Jhear.png'), await Canvas.loadImage('assets/images/Qhear.png'), await Canvas.loadImage('assets/images/Khear.png'), await Canvas.loadImage('assets/images/Ahear.png')],
            [await Canvas.loadImage('assets/images/Ndia.png'), await Canvas.loadImage('assets/images/Tndia.png'), await Canvas.loadImage('assets/images/Jdia.png'), await Canvas.loadImage('assets/images/Qdia.png'), await Canvas.loadImage('assets/images/Kdia.png'), await Canvas.loadImage('assets/images/Adia.png')],
            [await Canvas.loadImage('assets/images/Nclubs.png'), await Canvas.loadImage('assets/images/Tnclubs.png'), await Canvas.loadImage('assets/images/Jclubs.png'), await Canvas.loadImage('assets/images/Qclubs.png'), await Canvas.loadImage('assets/images/Kclubs.png'), await Canvas.loadImage('assets/images/Aclubs.png')],
            [await Canvas.loadImage('assets/images/Nspa.png'), await Canvas.loadImage('assets/images/Tnspa.png'), await Canvas.loadImage('assets/images/Jspa.png'), await Canvas.loadImage('assets/images/Qspa.png'), await Canvas.loadImage('assets/images/Kspa.png'), await Canvas.loadImage('assets/images/Aspa.png')],
            [await Canvas.loadImage('assets/images/Square.png'), await Canvas.loadImage('assets/images/Order.png'), await Canvas.loadImage('assets/images/Pass.png')]
        ];

        cards[0].reverse();
        cards[1].reverse();
        cards[2].reverse();
        cards[3].reverse();

        secondRound = [await Canvas.loadImage('assets/images/Heart.png'), await Canvas.loadImage('assets/images/Diamon.png'), await Canvas.loadImage('assets/images/Clubs.png'), await Canvas.loadImage('assets/images/Spades.png'), await Canvas.loadImage('assets/images/NoBid.png')]

        bidIndicators = [
            await Canvas.loadImage('assets/images/bitmap33.png'), await Canvas.loadImage('assets/images/bitmap34.png'), await Canvas.loadImage('assets/images/bitmap35.png'), await Canvas.loadImage('assets/images/bitmap36.png'), await Canvas.loadImage('assets/images/bitmap37.png')
        ];
    },

    EuchreGame: class {
        players = [''];
        channels = new Map(); //player => channel

        constructor(playerIds) {
            prc.stdout.on('data', this.handleComputer);
            this.players = playerIds;
            var playerList = playerIds.join(',').replace('cpu', ' ');
            while (playerList.includes('cpu'))
                playerList = playerList.replace('cpu', ' ');
            stdinStream.push(playerList + "\n");
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
            this.tempData.forEach(data => {
                const split = data.split(':');
                var uzer = client.users.cache.find(person => split[0] == person.id);
                if (!split.includes("Cards"))
                    client.users.cache.find(person => split[0] == person.id).send(split[1 + split.indexOf("Message")]);
                else
                    sysoutGame(client.users.cache.find(person => split[0] == person.id), split[1 + split.indexOf("Cards")].split(','), split[1 + split.indexOf("Board")].split(','), split[1 + split.indexOf("Trump")].split(','), split[1 + split.indexOf("Score")].split(','), split.includes('Message') ? split[1 + split.indexOf("Message")] : "Empty Message")
            });
        }
    }
}