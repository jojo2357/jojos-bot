const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['connect-4', '4-in-row'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        //try {
            var user = arguments[0];
            if (user != undefined && arguments.length > 0 && user.indexOf('>') > 0)
                user = user.substring(3, 21);
            if (Manager.usersGame('<@' + message.author + '>') != null) {
                message.channel.send('sorry, <@' + message.author + '>' + ', but you already have a game in progress in <#' + Manager.usersGame('<@' + message.author + '>').channel + '>');
                return;
            }
            if (!message.guild.member(user) && user != undefined) {
                message.channel.send('Sorry i cant find that user in this server. Please try again');
                return;
            }
            if (user == '699366687455051808') {
                message.channel.send("Yes, I will play against you foolish mortal")
                user = null;
            }
            if (message.guild.members.fetch(user) && user) {
                if (user == message.author) {
                    message.channel.send("Go play with urself somewhere else :rolling_eyes:");
                    return;
                }
                var challenges = Manager.allChallenges('<@' + message.author + '>');
                var toThis = 0;
                for (var i = 0; i < challenges.length; i++) {
                    if (challenges[i].players.indexOf('<@' + user + '>') >= 0 && challenges[i].players.indexOf('<@' + message.author + '>') >= 0) {
                        toThis++;
                    }
                }
                if (toThis > 0) {
                    message.channel.send("Sorry, but you two already have a pending challenge. Wait for them to accept your challenge");
                    return;
                }
                var game = new Game.connect4game(['<@' + message.author + '>', '<@' + user + '>'], message.channel);
                Manager.addPending(game);
                message.channel.send('Hey <@' + user + '>! <@' + message.author + '> has challenged you to a connect-4 duel to the death. use `=accept` to accept')
            } else {
                if (!Game.botLoaded()){
                    message.channel.send('Brain is still loading, be patient');
                    return;
                }
                var game = new Game.connect4game(['<@' + message.author + '>', null], message.channel);
                game.startGame();
                game.makeInitialSend();
                Manager.addGame(game);
                const ch = new Discord.MessageEmbed()
                    .setColor('#0cc0b4')
                    .setTitle('Connect 4 duel to the death')
                    .setDescription('<@' + message.author + '>' + ' boutta loose bigtime')
                    .setTimestamp()
                    .setFooter('Haha, good luck! Brain is loading')
                message.channel.send(ch);
            }
        //} catch (err) {
        //    message.channel.send("An error has occured: " + err.message);
        //}
    }
}