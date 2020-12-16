const { MessageEmbed } = require('discord.js');
const customPrefixes = require('../../util/customPrefixes.js');

module.exports = {
    commands: ['dev', 'dev-notes', 'other'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        var prefix;
        if (message.guild != undefined)
            prefix = customPrefixes.get(message.guild.id);
        else
            prefix = customPrefixes.get('default');
        const help = new MessageEmbed()
            .setColor('#fff800')
            .setTitle('Developer Notes')
            .setDescription('Bot built, managed, and hosted by jojo2357#1417 with inspiration from PTZ#3259\nlicensed under MIT')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Suggest something', value: prefix + 'suggest', inline: true },
                { name: 'Planned Changes', value: prefix + 'TODO', inline: true },
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}