const { MessageEmbed } = require('discord.js');
const customPrefixes = require('./../../util/customPrefixes.js');

module.exports = {
    commands: ['tournament-help', 'tourney-help'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var prefix;
        if (message.guild != undefined)
            prefix = customPrefixes.get(message.guild.id);
        else
            prefix = customPrefixes.get('default');
        const help = new MessageEmbed()
            .setColor('#fff800')
            .setTitle('Connect tournament help')
            .setDescription('**Global** tournaments allow participants to sign up from any server that the bot is in.\n**Local** tournaments only allow participants from the server that it was created in to join.')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Create a local tournament', value: prefix + 'create local', inline: true },
                { name: 'Create a global tournament', value: 'currently disabled unless you are the jojo', inline: true },
                { name: 'Show tournaments', value: prefix + 'show-tournaments', inline: true },
                { name: 'Sign up for a tournament', value: prefix + 'sign-up `ID`', inline: true },
                { name: 'Schedule your tournament to start', value: prefix + 'begin `hh` `mm`\nwhere hh is in 24 hour time and PST', inline: true },
                { name: 'View participants in a tournament', value: prefix + 'show-tournament `ID`', inline: true },
                { name: 'Leave tournament', value: 'jk havent added that yet', inline: true },
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}