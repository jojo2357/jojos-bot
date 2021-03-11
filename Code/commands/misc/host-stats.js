const { totalmem, freemem, platform } = require('os');
const { MessageEmbed } = require('discord.js');
const RemoteConsole = require('./../../util/remoteConsole.js');

const btogb = Math.pow(1024, 3);

module.exports = {
    commands: ['host-stats', 'host-stat', 'hs'],
    maxArgs: 0,
    callback: (message) => {
        if (message.channel.type == 'dm' && message.author.id == '524411594009083933'){
            RemoteConsole.resendHostStatus();
            return;
        }
        const tot = totalmem();
        const free = freemem();
        const used = tot - free;
        console.log(((Math.ceil(255 * (used / tot))) << 16 | (Math.ceil(255 - (255 * (used / tot)))) << 8) & 0xFFFF00);
        const help = new MessageEmbed()
            .setColor(((Math.ceil(55 + 400 * (-0.5 + (used / tot)))) << 16 | (Math.ceil(255 - (400 * (-0.5 + ((used / tot)))))) << 8) & 0xFFFF00)
            .setTitle('Current state of machine:')
            .setDescription(
                'Operating system: ' + platform().toString() + '\n' +
                'Memory used: ' + ((used / btogb)).toFixed(2) + ' GB/' +
                (tot / btogb).toFixed(2) + ' GB (' + ((used / tot) * 100).toFixed(0) + '%)'
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}