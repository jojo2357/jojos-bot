let cypherHard = ['Bytes 001:\n\n41 20 6b 68 63 70 62 20 61 20 6f 61 68 20 72 70 63 62 20 68 77 64 7a 20 6b 7a 61 69 6e 20 20 6d 70 76 63 20 63 77 20 73 61 68 2e', 'Bytes 002:\n\n21 73 79 61 64 20 72 75 6f 79 20 74 65 72 67 65 72 20 75 6f 79 20 73 65 6b 61 6d 20 79 61 64 20 61 20 65 67 6e 65 6c 6c 61 68 63 20 41']
const Discord = require('discord.js');

module.exports = {
    commands: ['bytes-easy', 'be'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const ch = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle(cypherHard[Math.floor(Math.random() * cypherHard.length)])
        .setTimestamp()
        .setFooter('Haha, good luck!')
        message.channel.send(ch);
    }
}