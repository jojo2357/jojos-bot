const Discord = require('discord.js');

module.exports = {
    commands: ['dev', 'dev-notes', 'other'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const help = new Discord.MessageEmbed()
            .setColor('#fff800')
            .setTitle('Developer Notes')
            .setDescription('Bot built, managed, and hosted by jojo2357#1417 with inspiration from PTZ#3259\nlicensed under MIT')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Suggest something', value: '=suggest', inline: true },
                { name: 'Planned Changes', value: '=TODO', inline: true },
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}