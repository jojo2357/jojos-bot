const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['connect-4', '4-in-row'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        const user = message.mentions.users.first();
        if (Manager.usersGame('<@' + message.author + '>') != null){
            message.channel.send('sorry, <@' + message.author + '>' + ', but you already have a game in progress in <#' + Manager.usersGame('<@' + message.author + '>').channel + '>');
            return;
        }
        let game = new Game.connect4game('<@' + message.author + '>', message.channel);
        game.startGame();
        Manager.addGame(game); 
        const ch = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('Connect 4 duel to the death')
        .setDescription('<@' + message.author + '>' + ' boutta loose bigtime')
        .setTimestamp()
        .setFooter('Haha, good luck! Brain is loading')
        message.channel.send(ch);
    }
}