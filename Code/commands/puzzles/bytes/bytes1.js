const Discord = require('discord.js');

module.exports = {
    commands: ['bytes1', 'b1'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha2 = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('A bytes a day gets your brain melt to hay.')
        .setTimestamp()
        message.channel.send(cha2);
    }
}