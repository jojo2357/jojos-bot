const { MessageAttachment } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const stream = require('stream');
const fs = require('fs');
const { platform } = require('os');
const { spawn } = require('child_process');
const getUser = require('./../../../util/getUser.js');
const manager = require('./euchre-game-manager.js');

let delay = 1500;
let defaultComputer;
let cards;
let blankCard;
let bidIndicators;
let client;
let secondRound;
let lastBoard = new Map();

let windowsProgram = 'ConsoleApplication2.exe';
let linuxProgram = 'a.out';

var prc;
var stdinStream;

let sysoutGame = async function (channel, playerCards = ["", "", "", "", ""], board = ["", "", "", ""], bidDicators = ['4', '4', '4', '4'], score = ['0', '0', '0', '0', '0', '0'], message = "Empty Message") {
    const euchreGame = manager.usersGame(channel.id);
    const canvas = createCanvas(170, 224);
    const ctx = canvas.getContext('2d');
    //Player cards
    playerCards = playerCards.filter(card => card != "-1");
    ctx.fillStyle = "black";
    for (var i = 0; i < playerCards.length; i++)
        if (playerCards[i] && playerCards[i] >= 0) {
            ctx.beginPath();
            ctx.rect(Math.floor(25 * (i + 0.5 * (5 - playerCards.length))) - 1, 129, 73, 98);
            ctx.stroke();
            ctx.drawImage(cards[Math.floor(parseInt(playerCards[i]) / 6)][parseInt(playerCards[i]) % 6], Math.floor(25 * (i + 0.5 * (5 - playerCards.length))) + 0, 130, 71, 96);
        }
    /*else
ctx.drawImage(blankCard, 25 * i + 35, 240, 71, 96);*/
    //bid squares:
    ctx.drawImage(bidIndicators[bidDicators[0]], 85 - 3, 64 + 3, 11, 11);
    ctx.drawImage(bidIndicators[bidDicators[1]], 70 - 3, 55 + 3, 11, 11);
    ctx.drawImage(bidIndicators[bidDicators[3]], 100 - 3, 55 + 3, 11, 11);
    ctx.drawImage(bidIndicators[bidDicators[2]], 85 - 3, 46 + 3, 11, 11);
    ctx.font = '14px Arial';
    ctx.fillStyle = '#66FFFF';
    ctx.fillText(`     G P T\nUs ${score[0]} ${score[1]} ${score[2]}`, 0, 12);
    ctx.fillText(`      G P T\n'Em ${score[3]} ${score[4]} ${score[5]}`, 110, 12);
    for (var i = 0; i < 4; i++) {
        if (board[i] <= 26)
            ctx.drawImage(cards[Math.floor(parseInt(board[i]) / 6)][parseInt(board[i]) % 6], 150 - 80 - Math.floor(50 * Math.sin(i * 0.5 * Math.PI)), 40 + Math.floor(41 * Math.cos(i * 0.5 * Math.PI)), Math.floor(71 / 2), Math.floor(96 / 2))
        else
            ctx.drawImage(secondRound[board[i] - 27], 150 - 80 - 50 * Math.sin(i * 0.5 * Math.PI), 40 + 41 * Math.cos(i * 0.5 * Math.PI), Math.floor(71 / 2), Math.floor(96 / 2))
    }

    for (var i = 0; i < 4; i++) {
        var offsetIndex = (i + euchreGame.players.indexOf(channel.id)) % 4;
        if (board[i] == 24) {
            var person = euchreGame.players[offsetIndex];
            ctx.drawImage(euchreGame.pfps[person], 80 - Math.floor(50 * Math.sin(i * 0.5 * Math.PI)), 55 + Math.floor(41 * Math.cos(i * 0.5 * Math.PI)), 16, 16)
        }
    }

    if (channel.id == euchreGame.rootPlayer){
        try{
            await euchreGame.lastMessage.delete();
        }catch (err){}
        const secondCanvas = createCanvas(170, 128);
        const secondCTX = secondCanvas.getContext('2d');
        secondCTX.drawImage(canvas, 0, 0);
        euchreGame.lastMessage = await (euchreGame.rootChannel.send('', new MessageAttachment(secondCanvas.toBuffer(), 'spectateGame.png')));
    }

    const attachment = new MessageAttachment(canvas.toBuffer(), 'game.png');
    channel.send(message, attachment);
};

let getPfp = async function (player) {
    return await (loadImage(getUser.getUserFromMention(player).displayAvatarURL({
        format: 'png',
    })));
};

module.exports = {
    successfulCompile: false,

    killChild(){
        prc.kill();
    },

    init(klient) {
        console.log('Start loading euchre assets');
        client = klient;

        if (!fs.existsSync(process.cwd() + '/assets/euchre/' + windowsProgram) && !fs.existsSync(process.cwd() + '/assets/euchre/' + linuxProgram)) {
            console.log("Euchre bot not found");
            return;
        }

        stdinStream = new stream.Readable({
            read(size) {
                return true;
            }
        });

        prc = platform().toString().includes('win') ? spawn(process.cwd() + '/assets/euchre/' + windowsProgram.split('.')[0]) : spawn(process.cwd() + '/assets/euchre/' + linuxProgram);

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
        this.successfulCompile = true;
        console.log('Finished loading euchre assets');
    },

    async loadCards() {
        blankCard = await loadImage(process.cwd() + '/assets/images/euchre/Square.png');

        cards = [
            [await loadImage(process.cwd() + '/assets/images/euchre/Nhear.png'), await loadImage(process.cwd() + '/assets/images/euchre/Tnhear.png'), await loadImage(process.cwd() + '/assets/images/euchre/Jhear.png'), await loadImage(process.cwd() + '/assets/images/euchre/Qhear.png'), await loadImage(process.cwd() + '/assets/images/euchre/Khear.png'), await loadImage(process.cwd() + '/assets/images/euchre/Ahear.png')],
            [await loadImage(process.cwd() + '/assets/images/euchre/Ndia.png'), await loadImage(process.cwd() + '/assets/images/euchre/Tndia.png'), await loadImage(process.cwd() + '/assets/images/euchre/Jdia.png'), await loadImage(process.cwd() + '/assets/images/euchre/Qdia.png'), await loadImage(process.cwd() + '/assets/images/euchre/Kdia.png'), await loadImage(process.cwd() + '/assets/images/euchre/Adia.png')],
            [await loadImage(process.cwd() + '/assets/images/euchre/Nclubs.png'), await loadImage(process.cwd() + '/assets/images/euchre/Tnclubs.png'), await loadImage(process.cwd() + '/assets/images/euchre/Jclubs.png'), await loadImage(process.cwd() + '/assets/images/euchre/Qclubs.png'), await loadImage(process.cwd() + '/assets/images/euchre/Kclubs.png'), await loadImage(process.cwd() + '/assets/images/euchre/Aclubs.png')],
            [await loadImage(process.cwd() + '/assets/images/euchre/Nspa.png'), await loadImage(process.cwd() + '/assets/images/euchre/Tnspa.png'), await loadImage(process.cwd() + '/assets/images/euchre/Jspa.png'), await loadImage(process.cwd() + '/assets/images/euchre/Qspa.png'), await loadImage(process.cwd() + '/assets/images/euchre/Kspa.png'), await loadImage(process.cwd() + '/assets/images/euchre/Aspa.png')],
            [await loadImage(process.cwd() + '/assets/images/euchre/Square.png'), await loadImage(process.cwd() + '/assets/images/euchre/Order.png'), await loadImage(process.cwd() + '/assets/images/euchre/Pass.png')]
        ];

        cards[0].reverse();
        cards[1].reverse();
        cards[2].reverse();
        cards[3].reverse();

        secondRound = [await loadImage(process.cwd() + '/assets/images/euchre/Heart.png'), await loadImage(process.cwd() + '/assets/images/euchre/Diamon.png'), await loadImage(process.cwd() + '/assets/images/euchre/Clubs.png'), await loadImage(process.cwd() + '/assets/images/euchre/Spades.png'), await loadImage(process.cwd() + '/assets/images/euchre/Nobid.png'), await loadImage(process.cwd() + '/assets/images/euchre/GoneLone.png')]

        bidIndicators = [
            await loadImage(process.cwd() + '/assets/images/euchre/bitmap33.png'), await loadImage(process.cwd() + '/assets/images/euchre/bitmap34.png'), await loadImage(process.cwd() + '/assets/images/euchre/bitmap35.png'), await loadImage(process.cwd() + '/assets/images/euchre/bitmap36.png'), await loadImage(process.cwd() + '/assets/images/euchre/bitmap37.png')
        ];

        defaultComputer = await loadImage(process.cwd() + '/assets/images/euchre/DefaultComputer.png');
    },

    EuchreGame: class {
        pfps = new Map();
        players = [''];
        channels = new Map(); //player => channel

        constructor(playerIds = ['cpu', 'cpu', 'cpu', 'cpu'], originChannel) {
            prc.stdout.on('data', this.handleComputer);
            for (var i = 0; i < 4; i++) {
                playerIds[i] = playerIds[i].replace('<', '').replace('@', '').replace('!', '').replace('>', '').replace('cpu', ' ').replace('789368852936917002', ' ').replace('699366687455051808', ' ');
            }
            this.players = playerIds;
            stdinStream.push(playerIds.join(',') + "\n");
            this.players.forEach(player => {
                if (player == ' ')
                    this.pfps[player] = defaultComputer;
                else
                    this.doPFP(player);
            });
            this.rootPlayer = this.players[0];
            this.rootChannel = originChannel;
        }

        async doPFP(player) {
            this.pfps[player] = await getPfp(player);
        }

        makeMove(move) {
            stdinStream.push(move + '\n');
        }

        handleComputer(data) {
            data = data.toString();
            this.tempData = [];
            data.split(/(\r\n|\r|\n)/gm).forEach(line => {
                if (line.includes("Enter") || line.length == 0 && line != '\n')
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
                    setTimeout((uzer, split) => uzer.send(split[1 + split.indexOf("Message")]).catch(console.log), delay, uzer, split);
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
