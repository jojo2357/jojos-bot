const Discord = require('discord.js');

module.exports = {
    commands: ['vote-perks'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const msg = new Discord.MessageEmbed()
            .setColor('#fff800')
            .setTitle('Vote perks')
            .setDescription('Here are some perks you can get by voting for me at https://top.gg/bot/699366687455051808/vote')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: "Global tournies", value: 'Not implemented yet, if people actually want this, please lmk thru `=suggest vote perk: tournies`', inline: true },
            ).setTimestamp()
            .setFooter('More perks coming soon!');
        message.channel.send(msg);
    }
}