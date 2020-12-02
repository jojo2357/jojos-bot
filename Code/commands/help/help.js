const Discord = require('discord.js');
const prefixManager = require('../../util/customPrefixes.js');

module.exports = {
    commands: 'help',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var prefix;
        if (message.guild != undefined)
            prefix = prefixManager.get(message.guild.id);
        else
            prefix = prefixManager.get('default');
        const help = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Commands')
            .setAuthor('Jojo2357\'s bot')
            .setDescription('All commands. Type in the chat the description for more info about those commands.\nIf you have any questions, friend me at jojo2357#1417 and I can help you out')
            .addFields(
                { name: 'Connect-4 help', value: 'connect-4-help', inline: true },
                { name: 'Create a connect 4 game', value: prefix + 'connect-4', inline: true },
                { name: 'Cypher', value: prefix + 'cypher', inline: true },
                { name: 'Music Recommendations', value: prefix + 'song', inline: true },
                { name: 'Dev Notes', value: prefix + 'dev', inline: true },
                { name: 'Java Tips', value: prefix + 'java-help', inline: true },
                { name: 'Make a suggestion/report a bug', value: prefix + 'suggest/' + prefix + 'bug', inline: true },
                { name: 'My invite link', value: prefix + 'invite', inline: true },
                { name: 'Notifications and settings', value: prefix + 'settings-help', inline: true },
                { name: 'Windows hacks', value: prefix + 'win-hax', inline: true },
                { name: 'Privacy disclaimer', value: prefix + 'privacy', inline: true },
                { name: 'Vote perks', value: prefix + 'vote-perks', inline: true },
                { name: 'Top.gg vote link', value: prefix + 'vote', inline: true },
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}