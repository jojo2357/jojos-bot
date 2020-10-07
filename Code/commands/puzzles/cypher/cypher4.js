const Discord = require('discord.js');

module.exports = {
    commands: ['cypher004', 'c4'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const cha2 = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle('Do you find it very challenging to decode these cyphers? Well there are many websites and sources that may help you in this journey! Type "-help sources cypher" or "-help sc" to get some websites that might just help you a lot ! There are other decoding games you can play like bytes and more! Also, the answers for cyphers can be found by "-c<cypher number>". For example, this is cypher 4, which means you can type "c4" to see the answers!')
        .setTimestamp()
        message.channel.send(cha2);
    }
}