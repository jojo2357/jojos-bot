const { loadImage, createCanvas } = require('canvas');
const Discord = require('discord.js');

let cards;
let blankCard;
let client;
let deckSize = 54;

function cardName(card) {
    switch (Math.floor(card / 4)) {
        case 0:
            return 'three';
        case 1:
            return 'four';
        case 2:
            return 'five';
        case 3:
            return 'six';
        case 4:
            return 'seven';
        case 5:
            return 'eight';
        case 6:
            return 'nine';
        case 7:
            return 'ten';
        case 8:
            return 'jack';
        case 9:
            return 'queen';
        case 10:
            return 'king';
        case 11:
            return 'ace';
        case 12:
            return 'two';
        case 13:
            return 'joker';
    }
}

function valueOf(string = "") {
    switch (string.toLowerCase()) {
        case '3':
            return 0;
        case '4':
            return 1;
        case '5':
            return 2;
        case '6':
            return 3;
        case '7':
            return 4;
        case '8':
            return 5;
        case '9':
            return 6;
        case '10':
            return 7;
        case 'j':
            return 8;
        case 'q':
            return 9;
        case 'k':
            return 10;
        case 'a':
            return 11;
        case '2':
            return 12;
        case 'joker':
            return 13;
    }
}

module.exports = {
    setClient(klient) {
        client = klient;
    },

    init() {
        console.log('Start loading scum assets');
        this.loadCards();
        console.log('Finnished loading scum assets');
    },

    async loadCards() {
        cards = [];
        blankCard = await loadImage(`assets/images/scum/blank.png`)
        let cardNames = ['3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace', '2'];
        cardNames.forEach(async function(i) {
            cards.push(await loadImage(`assets/images/scum/${i}_of_hearts.png`));
            cards.push(await loadImage(`assets/images/scum/${i}_of_diamonds.png`));
            cards.push(await loadImage(`assets/images/scum/${i}_of_spades.png`));
            cards.push(await loadImage(`assets/images/scum/${i}_of_clubs.png`));
        });
        cards.push(await loadImage(`assets/images/scum/black_joker.png`));
        cards.push(await loadImage(`assets/images/scum/red_joker.png`));
    },

    ScumGame: class {
        constructor(hostChannel, owner) {
            this.players = [owner];
            this.hostChannel = hostChannel;
            this.owner = owner;
            this.shuffleDeck();
            this.turn = 0;
            this.lastPlay = [];
            this.currentPlace = 0;
            this.finishedAGame = false;
            this.passingCards = false;
            this.direction = 1;
            this.playing = false;
        }

        addPlayer(player) {
            if (this.playing)
                return false;
            if (this.players.filter(playa => playa.id === player.id).length > 0)
                return false;
            this.players.push(player);
            this.players[this.players.length - 1].tradeCards = [];
            this.players[this.players.length - 1].hand = [];
            this.loadPFPs();
            this.dealCards();
            return true;
        }

        //deck #/4 where [0,3] is 3, etc
        shuffleDeck() {
            this.deck = [];
            const tempDeck = [];
            for (let i = 0; i < deckSize; i++) {
                tempDeck.push(i);
            }
            while (tempDeck.length > 0) {
                const randomCard = Math.floor(Math.random() * tempDeck.length);
                this.deck.push(tempDeck[randomCard]);
                tempDeck.splice(randomCard, 1);
            }
        }

        sortHands() {
            this.players.forEach(async player => {
                player.hand.sort((a, b) => {
                    if (a > b) return 1;
                    if (a < b) return -1;
                    return 0;
                })
            })
        }

        dealCards() {
            let j;
            let i;
            this.shuffleDeck();
            for (i = 0; i < this.players.length; i++) {
                this.players[i].hand = [];
                for (j = i; j < deckSize; j += this.players.length) {
                    this.players[i].hand.push(this.deck[j]);
                }
            }
            this.sortHands();
            for (j = 0; j < this.players.length; j++)
                if (this.players[j].finishSpot >= this.players.length / 2) {
                    this.players[j].tradeCards = [-1];
                    for (i = 0; i < Math.floor(Math.abs(this.players[j].finishSpot - ((this.players.length - 1) / 2)) + 0.5 * ((this.players.length + 1) % 2)); i++) {
                        this.players[j].tradeCards.push(this.players[j].hand[this.players[j].hand.length - 1 - i]);
                    }
                    this.players[j].tradeCards.splice(0, 1);
                }
        }

        loadPFPs() {
            this.players.forEach(async player => {
                player.pfp = await loadImage(player.displayAvatarURL({
                    format: 'png',
                }));
            });
        }

        onSetTradeCards(message, args = ['']) {
            let j;
            let k;
            let i;
            this.players.forEach(player => { if (player.tradeCards === undefined) player.tradeCards = []; })
            if (!this.passingCards) {
                message.reply('Why u tryna pass away cards?')
                return;
            }
            const pleyer = this.players.filter(player => player.id === message.author.id)[0];
            const theIndex = this.players.indexOf(pleyer);
            if (this.players[theIndex].tradeCards !== undefined && this.players[theIndex].tradeCards.length === Math.floor(Math.abs(this.players[theIndex].finishSpot - ((this.players.length - 1) / 2)) + 0.5 * ((this.players.length + 1) % 2))) {
                message.reply('Knock it off you are done');
            }
            var strengthAmounts = [];
            for (i = 0; i <= 13; i++)
                strengthAmounts.push(this.countPower(i, this.players[theIndex]))
            args.forEach(card => {
                strengthAmounts[valueOf(card)]--;
            });
            strengthAmounts.forEach(after => {
                if (after < 0) {
                    message.reply(`You dont have enough ${cardName(strengthAmounts.indexOf(after))}s!`)
                    return;
                }
            });
            this.players[theIndex].tradeCards = [-1];
            for (i = 0; i < args.length; i++)
                this.players[theIndex].tradeCards.push(valueOf(args[i]));
            this.players[theIndex].tradeCards.splice(0, 1);
            let done = true;
            for (i = 0; i < this.players.length; i++) {
                console.log(this.players[i].tradeCards);
                done = done && (this.players[i].tradeCards.length === Math.floor(Math.abs(this.players[i].finishSpot - ((this.players.length - 1) / 2)) + 0.5 * ((this.players.length + 1) % 2)));
            }
            if (done) {
                this.passingCards = false;
                for (i = 0; i < Math.floor(this.players.length / 2); i++) {
                    const winningPlayerIndex = this.players.indexOf(this.players.find(player => player.finishSpot === i));
                    const losingPlayerIndex = this.players.indexOf(this.players.find(player => player.finishSpot === this.players.length - 1 - i));
                    for (k = this.players[winningPlayerIndex].tradeCards.length - 1; k >= 0; k--) {
                        for (j = 0; j < 4; j++) {
                            if (this.players[winningPlayerIndex].hand.includes(this.players[winningPlayerIndex].tradeCards[k] * 4 + j)) {
                                this.players[losingPlayerIndex].hand.push(this.players[winningPlayerIndex].tradeCards[k] * 4 + j);
                                this.players[winningPlayerIndex].hand.splice(this.players[winningPlayerIndex].hand.indexOf(this.players[winningPlayerIndex].tradeCards[k] * 4 + j), 1);
                                this.players[winningPlayerIndex].tradeCards.splice(k, 1);
                                break;
                            }
                        }
                    }
                }
                for (i = 0; i < Math.floor(this.players.length / 2); i++) {
                    const winningPlayerIndex = this.players.indexOf(this.players.find(player => player.finishSpot === i));
                    const losingPlayerIndex = this.players.indexOf(this.players.find(player => player.finishSpot === this.players.length - 1 - i));
                    for (k = this.players[losingPlayerIndex].tradeCards.length - 1; k >= 0; k--) {
                        for (j = 0; j < 4; j++) {
                            if (this.players[losingPlayerIndex].hand.includes(this.players[losingPlayerIndex].tradeCards[k])) {
                                this.players[winningPlayerIndex].hand.push(this.players[losingPlayerIndex].tradeCards[k]);
                                this.players[losingPlayerIndex].hand.splice(this.players[losingPlayerIndex].hand.indexOf(this.players[losingPlayerIndex].tradeCards[k]), 1);
                                this.players[losingPlayerIndex].tradeCards.splice(k, 1);
                                break;
                            }
                        }
                    }
                }
                this.players.forEach(player => player.finishSpot = -1);
                this.sortHands();
                this.sendHands();
            } else {
                message.reply('Pog, just waiting on others')
            }
        }

        async sendHand(player, withMessage = ' ') {
            let loc;
            let i;
            const canvas = createCanvas(Math.max(player.hand.length * 100 + 400, 1600), player.hand.length > 0 ? 2800 : 1600);
            const ctx = canvas.getContext('2d');
            let xdex = (canvas.width - player.hand.length * 100) / 2.0 - 50;
            player.hand.forEach(card => {
                ctx.drawImage(cards[card], xdex, 2000, 500, 726);
                xdex += 100;
            })
            ctx.strokeStyle = "green";
            ctx.font = "144px Arial";
            const offset = this.players.indexOf(player);
            for (i = 0; i < this.players.length; i++) {
                loc = [Math.floor(canvas.width / 2) + 750 * Math.sin((i - offset) / this.players.length * Math.PI * 2), 800 + 700 * Math.cos((i - offset) / this.players.length * Math.PI * 2)];
                //console.log((i - offset) / this.players.length * Math.PI * 2 + " " + );
                if (this.players[i].pfp === undefined) {
                    this.players[i].pfp = await loadImage(this.players[i].displayAvatarURL({
                        format: 'png',
                    }));
                }
                ctx.fillStyle = "green";
                ctx.beginPath();
                ctx.arc(loc[0] + this.players[i].pfp.width * 3 / 2 + 6, loc[1] + this.players[i].pfp.height / 2, this.players[i].pfp.height / 2, 0, Math.PI * 2);
                if (this.lastPlayer === i) {
                    ctx.fill();
                }
                ctx.lineWidth = 10;
                ctx.stroke();
                ctx.fillStyle = "red";
                if (this.players[i].passOnAll) {
                    ctx.beginPath();
                    ctx.moveTo(loc[0] + this.players[i].pfp.width + 6, loc[1] + this.players[i].pfp.height - 10);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width + 16, loc[1] + this.players[i].pfp.height);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width * 2 + 6, loc[1] + 10);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width * 2 - 4, loc[1]);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width + 6, loc[1] + this.players[i].pfp.height - 10);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.moveTo(loc[0] + this.players[i].pfp.width + 6, loc[1] + 10);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width + 16, loc[1]);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width * 2 + 6, loc[1] + this.players[i].pfp.height - 10);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width * 2 - 4, loc[1] + this.players[i].pfp.height);
                    ctx.lineTo(loc[0] + this.players[i].pfp.width + 6, loc[1] + 10);
                    ctx.fill();

                }
                ctx.drawImage(this.players[i].pfp, loc[0], loc[1]);
                ctx.fillText(this.players[i].hand.length + "", loc[0], loc[1]);
            }
            ctx.fillStyle = "yellow";
            ctx.fillText(this.players[this.turn].hand.length + "", Math.floor(canvas.width / 2) + 750 * Math.sin((this.turn - offset) / this.players.length * Math.PI * 2), 800 + 700 * Math.cos((this.turn - offset) / this.players.length * Math.PI * 2));
            ctx.fillStyle = "green";
            for (i = 0; i < this.players.length; i++) {
                if (this.players[i].hand.length > 0)
                    continue;
                loc = [Math.floor(canvas.width / 2) + 750 * Math.sin((i - offset) / this.players.length * Math.PI * 2), 800 + 700 * Math.cos((i - offset) / this.players.length * Math.PI * 2)];
                ctx.drawImage(this.players[i].pfp, loc[0], loc[1]);
                ctx.fillText(this.players[i].hand.length + "", loc[0], loc[1]);
            }
            xdex = 0;
            if (this.lastPlay.length > 0)
                this.lastPlay.forEach(card => ctx.drawImage(cards[card], Math.floor(canvas.width / 2) - 50 * (this.lastPlay.length - 1) + 100 * (xdex++), 400));
            else
                ctx.drawImage(blankCard, Math.floor(canvas.width / 2), 400)
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'testBoard.png');
            client.users.cache.get(player.id).send(withMessage, attachment);
        }

        async sendHands() {
            let i;
            let loc;
            this.playing = true;
            if (this.players[this.players.length - 1].hand === undefined) {
                this.dealCards();
            }
            this.players.forEach(async player => {
                await this.sendHand(player, 'Get good')
            });
            const canvas = createCanvas(4000, 2500);
            const ctx = canvas.getContext('2d');
            ctx.font = "144px Arial";
            ctx.fillStyle = "red";
            const offset = 0;
            for (i = 0; i < this.players.length; i++) {
                loc = [2000 + 750 * Math.sin((i - offset) / this.players.length * Math.PI * 2), 1000 + 700 * Math.cos((i - offset) / this.players.length * Math.PI * 2)];
                //console.log((i - offset) / this.players.length * Math.PI * 2 + " " + );
                if (this.players[i].pfp === undefined) {
                    this.players[i].pfp = await loadImage(this.players[i].displayAvatarURL({
                        format: 'png',
                    }));
                }
                console.log(this.players[i].pfp, loc[0], loc[1]);
                ctx.drawImage(this.players[i].pfp, loc[0], loc[1]);
                ctx.fillText(this.players[i].hand.length + "", loc[0], loc[1]);
            }
            ctx.fillStyle = "yellow";
            ctx.fillText(this.players[this.turn].hand.length + "", 2000 + 750 * Math.sin((this.turn - offset) / this.players.length * Math.PI * 2), 1000 + 700 * Math.cos((this.turn - offset) / this.players.length * Math.PI * 2));
            ctx.fillStyle = "green";
            for (i = 0; i < this.players.length; i++) {
                if (this.players[i].hand.length > 0)
                    continue;
                loc = [2000 + 750 * Math.sin((i - offset) / this.players.length * Math.PI * 2), 1000 + 700 * Math.cos((i - offset) / this.players.length * Math.PI * 2)];
                ctx.drawImage(this.players[i].pfp, loc[0], loc[1]);
                ctx.fillText(this.players[i].hand.length + "", loc[0], loc[1]);
            }
            var xdex = 0;
            if (this.lastPlay.length > 0)
                this.lastPlay.forEach(card => ctx.drawImage(cards[card], 1900 + 100 * (xdex++), 750));
            else
                ctx.drawImage(blankCard, 1900, 750)
            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'testBoard.png');
            this.hostChannel.send('Here\'s the current game: ', attachment).then(message => message.delete({ timeout: 6000 }));
            //this.players[0].createDM();
            //console.log(this.players[0]);
            //this.players.forEach(player => player.dmChannel.send(player.hand));
        }

        handleMessage(message, args) {
            if (this.passingCards)
                message.reply('Please wait while people decide which cards they dont like');
            else if (this.players.includes(message.author) && args[0] === 'all' && this.lastPlay.length !== 0)
                this.players[this.players.indexOf(message.author)].passOnAll = true;
            else if (this.turn !== this.players.indexOf(message.author))
                message.reply("its not ur turn i:b:iot");
            else if (this.lastPlay.length === 0 && (args[0] === 'pass' || args[0] === 'p'))
                message.reply('I cant let you pass up a free play');
            else {//passed fail conditions
                if (args[0] === 'pass' || args[0] === 'p') {
                    console.log('pass dictated');
                    do {
                        this.turn += this.direction;
                        if (this.turn === this.players.length)
                            this.turn = 0;
                        if (this.turn < 0)
                            this.turn = this.players.length - 1;
                        if (this.lastPlayer === this.turn) {
                            this.lastPlay = [];
                        }
                    } while (this.players[this.turn].hand.length === 0 || this.players[this.turn].hand.length < this.lastPlay.length || this.players[this.turn].passOnAll);
                    this.sendHands();
                    return;
                }
                const powerPlayed = valueOf(args[0]);
                let amountPlayed;
                if (this.lastPlay.length === 0 && args.length === 2)
                    amountPlayed = parseInt(args[1]);
                else if (this.lastPlay.length === 0 && args.length === 1) {
                    message.reply("How many?");
                    return;
                } else
                    amountPlayed = this.lastPlay.length;
                console.log(this.countPower(powerPlayed));
                if (this.countPower(powerPlayed) < amountPlayed)
                    message.reply(`nope`);
                else if (this.lastPlay.length === 0) {//free play?
                    if (!this.makeMove(powerPlayed, amountPlayed)) {
                        this.sendHands();
                    }
                } else {
                    if (Math.floor(this.lastPlay[0] / 4) > powerPlayed)
                        message.reply('play higher');
                    else if (amountPlayed !== this.lastPlay.length)
                        message.reply(`last play was ${this.lastPlay.length} ${cardName(this.lastPlay[0])}`);
                    else if (!this.makeMove(powerPlayed, amountPlayed))
                        this.sendHands();

                }
            }
        }

        countPower(power, player) {
            let wower = power;
            let amt = 0;
            player.hand.forEach(card => {
                if (wower * 4 <= card && (wower + 1) * 4 > card) {
                    amt++;
                }
            })
            return amt;
        }

        countPower(power) {
            let wower = power;
            let amt = 0;
            this.players[this.turn].hand.forEach(card => {
                if (wower * 4 <= card && (wower + 1) * 4 > card) {
                    amt++;
                }
            })
            return amt;
        }

        gameOver() {
            var count = 0;
            this.players.forEach(player => {
                if (player.hand.length > 0)
                    count++;
            });
            if (count === 1) {
                this.players.forEach(player => {
                    if (player.hand.length > 0) {
                        player.finishSpot = this.currentPlace++;
                        this.currentPlace = 0;
                        player.hand = [];
                    }
                })
            }
            this.finishedAGame |= count <= 1;
            return count <= 1;
        }

        makeMove(power, amount) {
            this.lastPlay = [];
            this.players[this.turn].hand.forEach(card => {
                if (amount > 0 && power * 4 <= card && (power + 1) * 4 > card) {
                    this.lastPlay.push(card);
                    amount--;
                }
            });
            this.lastPlay.forEach(card => this.players[this.turn].hand.splice(this.players[this.turn].hand.indexOf(card), 1));
            if (this.players[this.turn].hand.length === 0) {
                this.players[this.turn].finishSpot = this.currentPlace++;
            }
            this.lastPlayer = this.turn;
            if (this.gameOver()) {
                console.log("gg dtected");
                let winDex = 0;
                this.players.forEach(player => {
                    if (player.finishSpot === 0) winDex = this.players.indexOf(player)
                })
                this.lastPlay = [];
                this.dealCards();
                this.promptDiscard();
                this.passingCards = true;
                this.turn = winDex;
                this.direction = this.determineDirection();
                return true;
            }
            const start = this.turn;
            do {
                this.turn += this.direction;
                if (this.turn === this.players.length)
                    this.turn = 0;
                if (this.turn < 0)
                    this.turn = this.players.length - 1;
                if (this.lastPlayer === this.turn) {
                    if (start === this.turn)
                        this.sendHands();
                    this.lastPlay = [];
                    this.players.forEach(player => player.passOnAll = false);
                }
            } while (this.players[this.turn].hand.length === 0 || this.players[this.turn].hand.length < this.lastPlay.length || this.players[this.turn].passOnAll);
            return false;
        }

        promptDiscard() {
            this.players.forEach(player => {
                console.log(`${player.username} Finnished = ${player.finishSpot} total people = ${this.players.length}`);
                if (player.finishSpot < Math.floor(this.players.length / 2))
                    this.sendHand(player, `You finnished #${player.finishSpot + 1}/${this.players.length} \nPlease select ${Math.floor(Math.abs(player.finishSpot - ((this.players.length - 1) / 2)) + 0.5 * ((this.players.length - 1) % 2))} cards to give away. For example, use \`=give 3\` to give away a single 3. To give away two threes, do \`=give 3 3\` (must give all cards in one command, and specify each card to give)`);
                else
                    this.sendHand(player, `You finnished #${player.finishSpot + 1}/${this.players.length} \nYour top ${Math.floor(Math.abs(player.finishSpot - ((this.players.length - 1) / 2)) + 0.5 * ((this.players.length - 1) % 2))} cards are gonna b gone so sux to sux ig.`);
            });
        }

        determineDirection() {
            const indexOfWinner = this.players.indexOf(this.players.find(player => player.finishSpot === 0));
            const indexOfLoser = this.players.indexOf(this.players.find(player => player.finishSpot === this.players.length - 1));
            if (indexOfWinner - indexOfLoser > this.players.length)
                return 1;
            if (indexOfLoser - indexOfWinner > this.players.length)
                return -1;
            var above = (indexOfWinner + 1) % this.players.length;
            var below = (indexOfWinner - 1 + this.players.length) % this.players.length;
            if (this.players[above].finishSpot < this.players[below].finishSpot)
                return 1;
            return -1;
        }
    }
}