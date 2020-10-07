const Discord = require('discord.js');

module.exports = {
    commands: ['cypher002', 'c2'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha2 = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('Cypher was invented by Julius Caesar, a great king and commander for Rome a long time ago. He used this to send messages to others with out anyone knowing what is on there if someone had found it.')
        .setTimestamp()
        message.channel.send(cha2);
    }
}