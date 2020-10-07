const Discord = require('discord.js');

module.exports = {
    commands: ['tap-code001', 'tc5'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha2 = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('A tap code a day makes your patience go away!')
        .setTimestamp()
        message.channel.send(cha2);
    }
}