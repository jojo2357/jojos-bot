const { MessageEmbed } = require('discord.js');
const { getRandomName} = require('./music-manager');

var out;
var putIn;

module.exports = {
    commands: ['songs', 'song'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '`<amount of reccomendations>`',
    callback: (message, arguments) => {
        out = '!p ' + getRandomName();
        putIn = "";
        if (parseInt(arguments[0]) < 1 || parseInt(arguments[0]) > 50 || isNaN(parseInt(arguments[0]))) {
            message.reply("No. bad. stop")
            return;
        }
        for (var i = 0; i < parseInt(arguments[0]) - 1; i++) {
            putIn = getRandomName();
            while (out.includes(putIn)) {
                putIn = musick.getRandomName();
            }
            out += '\n!p ' + putIn;
        }
        const ch = new MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('Here\'s ' + parseInt(arguments[0]) + ' random song' + (parseInt(arguments[0]) == 1 ? '' : 's'))
            .setDescription(out)
            .setFooter('they are most definitely better than whatever meyers is playing');
        message.channel.send(ch);
    }
}