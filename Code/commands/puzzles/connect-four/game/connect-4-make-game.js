const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');
const fs = require('fs');

module.exports = {
    commands: ['connect-4', '4-in-row', 'c4'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        //try {
            var user = arguments[0];
            if (user != undefined && arguments.length > 0 && user.indexOf('>') > 0){
                console.log(user)
                if (user.indexOf('!') >= 0)
                    user = user.substring(3, 21);
                else
                    user = user.substring(2, 20);
                console.log(user)
            }
            if (Manager.usersGame('<@' + message.author.id + '>') != null) {
                message.channel.send('sorry, <@' + message.author.id + '>' + ', but you already have a game in progress in <#' + Manager.usersGame('<@' + message.author + '>').channel + '>');
                return;
            }
            if (message.guild != null && !message.guild.member(user) && user != undefined) {
                message.channel.send('Sorry i cant find that user in this server. Please try again');
                return;
            }
            if (user == '699366687455051808') {
                message.channel.send("Yes, I will play against you foolish mortal")
                user = null;
            }
            if (message.guild == null && user){
                message.channel.send('Sorry, I cant do that. You can either play against me here or go to a server and play them there')
            }else if (message.guild != null && message.guild.members.fetch(user) && user) {
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
                game.timeout = 3600000;
                Manager.addPending(game);
                message.channel.send('Hey <@' + user + '>! <@' + message.author + '> has challenged you to a connect-4 duel to the death. use `=accept` to accept')
            } else {
                if (!Game.botLoaded()){
                    message.channel.send('Brain is still loading, be patient');
                    return;
                }
                if (message.guild != undefined && !fs.existsSync('./assets/server-settings/' + message.guild.id + '.json'))
                    message.channel.send("**HEY**!! This server has not configured settings! Use `=server-settings` to get started in order to recieve updates and warnings before the bot restarts in order to not lose game data!")
                var game = new Game.connect4game(['<@' + message.author + '>', null], message.channel);
                if (message.guild == undefined){
                    game.timeout = 0;
                }else{
                    game.timeout = 3600000;
                }
                game.makeInitialSend();
                Manager.addGame(game);
                const ch = new Discord.MessageEmbed()
                    .setColor('#0cc0b4')
                    .setTitle('Connect 4 duel to the death')
                    .setDescription('<@' + message.author + '>' + ' boutta loose bigtime. Remember though, if you want to play another human, just mention them after `=connect-4`. Ypu can also use `=help` to see more commands')
                    .setTimestamp()
                    .setFooter('Haha, good luck! Brain is loading')
                message.channel.send(ch);
            }
        //} catch (err) {
        //    message.channel.send("An error has occured: " + err.message);
        //}
    }
}