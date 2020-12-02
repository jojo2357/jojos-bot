const Discord = require('discord.js');
const prefixManager = require('../../util/customPrefixes.js');

module.exports = {
    commands: ['help-c4', 'help-connect-4', 'connect-4-help'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var prefix;
        if (message.guild != undefined)
            prefix = prefixManager.get(message.guild.id);
        else
            prefix = prefixManager.get('default');
        const help = new Discord.MessageEmbed()
            .setColor('#fff800')
            .setTitle('Connect 4 Help')
            .setDescription('um, really hope you know how to play connect four. https://en.wikipedia.org/wiki/Connect_Four ig :shrug:\
                \nIf the bot is playing `thinking about connect-4`, then the brain is still loading. `=connect-4` means that the brain is finished loading'
            )
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: 'Make a move', value: 'simply enter the column number (1-7, 1 is far left, 7 far right, 4 is middle) or react with with the appropriate reaction', inline: true },
                { name: 'Start a solo game', value: prefix + 'connect-4', inline: true },
                { name: 'Challenge a friend', value: prefix + 'connect-4 @urFrend', inline: true },
                { name: 'Accept only challenge', value: prefix + 'accept', inline: true },
                { name: 'Accept one of many challenges', value: prefix + 'accept @challenger', inline: true },
                { name: 'Show your game', value: prefix + 'show', inline: true },
                { name: 'Quit your game', value: prefix + 'ff', inline: true },
                { name: 'List games', value: prefix + 'show-all', inline: true },
                { name: 'Show lifetime stats', value: prefix + 'connect-4-stats (optional)UserId/Mention', inline: true },
                { name: 'Current loaded ai', value: prefix + 'difficulty', inline: true },
                { name: 'Frequently asked questions', value: prefix + 'faq', inline: true },
                { name: 'Tournament commands', value: prefix + 'tournament-help', inline: true },
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}