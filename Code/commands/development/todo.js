const Discord = require('discord.js');

module.exports = {
    commands: ['TODO', 'todo', 'changelog'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const help = new Discord.MessageEmbed()
            .setColor('#fff800')
            .setTitle('Things to do:')
            .setDescription(
                'Add more songs (I only looked at 4 bands)\
                \nAllow people to pick apart the brain and see what it knows :)'
            )
            .setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}