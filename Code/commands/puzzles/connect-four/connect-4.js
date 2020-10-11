const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['connect-4', '4-in-row'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        const user = message.mentions.users.first();
        if (Manager.usersGame('<@' + message.author + '>') != null) {
            message.channel.send('sorry, <@' + message.author + '>' + ', but you already have a game in progress in <#' + Manager.usersGame('<@' + message.author + '>').channel + '>');
            return;
        }
        if (message.guild.members.fetch(user) && user) {
            if (user == message.author){
                message.channel.send("Go play with urself somewhere else :rolling_eyes:");
                return;
            }
            var challenges = Manager.allChallenges('<@' + message.author + '>');
            var toThis = 0;
            for (var i = 0; i < challenges.length; i++){
                if (challenges[i].players.indexOf('<@' + user + '>') >= 0 && challenges[i].players.indexOf('<@' + message.author + '>') >= 0){
                    toThis++;
                }
            }
            if (toThis > 0){
                message.channel.send("Sorry, but you two already have a pending challenge. please accept or decline the challenge");
                return;
            }
            var game = new Game.connect4game(['<@' + message.author + '>', '<@' + user + '>'], message.channel);
            Manager.addPending(game);
            message.channel.send('Hey <@' + user + '>! <@' + message.author + '> has challenged you to a connect-4 duel to the death')
        } else {
            var game = new Game.connect4game(['<@' + message.author + '>', null], message.channel);
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
}