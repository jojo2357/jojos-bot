var os = require('os');
const Discord = require('discord.js');

const btogb = Math.pow(1024, 3);

module.exports = {
    commands: ['host-stats', 'host-stat', 'hs'],
    maxArgs: 0,
    callback: (message, arguments) => {
        const tot = os.totalmem();
        const free = os.freemem();
        const used = tot - free;
        console.log(((Math.ceil(255 * (used) / (tot))) << 16 | (Math.ceil(255 - (255 * (used) / (tot)))) << 8) & 0xFFFF00);
        const help = new Discord.MessageEmbed()
            .setColor(((Math.ceil(55 + 400 * (-0.5 + (used) / (tot)))) << 16 | (Math.ceil(255 - (400 * (-0.5 + ((used) / (tot)))))) << 8) & 0xFFFF00)
            .setTitle('Current state of machine:')
            .setDescription(
                'Operating system: ' + os.platform().toString() + '\n' + 
                'Memory used: ' + ((used / btogb)).toFixed(2) + ' GB/' +
                (tot / btogb).toFixed(2) + ' GB (' + ((used) / (tot) * 100).toFixed(0) + '%)'
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}