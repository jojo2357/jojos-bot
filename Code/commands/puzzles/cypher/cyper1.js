const Discord = require('discord.js');

module.exports = {
    commands: ['cypher001', 'c1'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('Did you know that the cypher command was inspired by Jojo2357? This happened when he gave me a cypher to decode and I found that it was actually pretty fun.')
        .setTimestamp()
        message.channel.send(cha);
    }
}