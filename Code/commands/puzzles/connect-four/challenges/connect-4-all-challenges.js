const { MessageEmbed } = require('discord.js');
const Manager = require('./../game/connect-4-game-holder.js');

module.exports = {
    commands: ['all-challenges'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        var out = "An :regional_indicator_x: after their name means that they currently have a game in progress and therefore their challenge cannot be accepted\n";
        for (var i = 0; i < Manager.getPending().length; i++) {
            if (message.author == '524411594009083933')
                out += "Challenger: " + Manager.getPending()[i].players[0] + 'Challengee: ' + (Manager.getPending()[i].players[1]) + ((Manager.usersGame(Manager.getPending()[i].players[1]) != null ? ":regional_indicator_x:" : "") + '\n');
            else if (message.guild.channels.cache.get(Manager.getPending()[i].channel.id))
                out += "Challenger: " + Manager.getPending()[i].players[0] + 'Challengee: ' + (Manager.getPending()[i].players[1]) + ((Manager.usersGame(Manager.getPending()[i].players[1]) != null ? ":regional_indicator_x:" : "") + '\n');
        }
        const ch = new MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('All pending challenges')
            .setDescription(out);
        message.channel.send(ch);
    }
}