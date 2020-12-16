const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['vote-perks'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        const msg = new MessageEmbed()
            .setColor('#fff800')
            .setTitle('Vote perks')
            .setDescription('Here are some perks you can get by voting for me at https://top.gg/bot/699366687455051808/vote')
            .addFields(
                { name: '\u200B', value: '\u200B' },
                { name: "Darkmode connect-4", value: 'It is here! vote the bot to unlock darkmode connect-4 for 12 hours', inline: true },
                { name: "Global tournies", value: 'Not implemented yet, if people actually want this, please lmk thru `=suggest vote perk: tournies`', inline: true },
            ).setTimestamp()
            .setFooter('More perks coming soon!');
        message.channel.send(msg);
    }
}