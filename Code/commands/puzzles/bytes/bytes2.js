const Discord = require('discord.js');

module.exports = {
    commands: ['bytes2', 'b2'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha2 = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('A challenge a day makes you regret your days!')
        .setTimestamp()
        message.channel.send(cha2);
    }
}