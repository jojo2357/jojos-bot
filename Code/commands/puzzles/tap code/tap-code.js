let cypherHard = ['tap-code 001:\n\n. .  / .... ....  . .  ... .....  / . ...  ... ....  . ....  . .....  / . .  / . ....  . .  ..... ....  / ... ..  . .  . ...  . .....  .... ...  / ..... ....  ... ....  .... .....  .... ..  / ... .....  . .  .... ....  .. ....  . .....  ... ...  . ...  . .....  / .. ..  ... ....  / . .  ..... ..  . .  ..... ....  ']
const Discord = require('discord.js');

module.exports = {
    commands: ['tap-code', 'tc'],
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