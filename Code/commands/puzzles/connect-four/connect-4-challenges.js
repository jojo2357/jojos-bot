const Discord = require('discord.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['my-challenges', 'pending-challenges'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        const user = message.mentions.users.first();
        if (Manager.getChallenges('<@' + message.author + '>').length == 0) {
            message.channel.send('sorry, <@' + message.author + '>' + ', but nobody has challenged you to a game');
            return;
        }
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