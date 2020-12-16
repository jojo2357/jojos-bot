const { MessageEmbed } = require('discord.js');
const Manager = require('../game/connect-4-game-holder.js');
 
module.exports = {
    commands: ['my-challenges', 'pending-challenges', 'challenges'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        if (Manager.getChallenges('<@' + message.author + '>').length == 0) {
            message.channel.send('sorry, <@' + message.author + '>' + ', but nobody has challenged you to a game');
            return;
        }
        var out ="An :regional_indicator_x: after their name means that they currently have a game in progress and therefore their challenge cannot be accepted";
        for (var i = 0; i < Manager.getChallenges('<@' + message.author + '>').length; i++){
            out += "Challenger: " + Manager.getChallenges('<@' + message.author + '>')[i].players[0] + (Manager.usersGame('<@' + message.author + '>') != null ? ":regional_indicator_x:" : "");
        }
        const ch = new MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('Your pending challenges')
            .setDescription(out);
        message.channel.send(ch);
    }
}