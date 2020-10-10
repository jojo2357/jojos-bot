const Discord = require('discord.js');
const musick = require('./music-manager');

module.exports = {
    commands: ['songs', 'song'],
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments) => {
        var out = '!p ' + musick.getRandomName();
        var putIn = "";
        for (var i = 0; i < parseInt(arguments[0]) - 1; i++){
            putIn = musick.getRandomName();
            while (out.includes(putIn)){
                putIn = musick.getRandomName();
            }
            out += '\n!p ' + putIn;
        }
        const ch = new Discord.MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('Heres ' + arguments[0] + ' random songs')
            .setDescription(out)
            .setFooter('they are most definitely better than whatever meyers is playing');
        message.channel.send(ch);
    }
}