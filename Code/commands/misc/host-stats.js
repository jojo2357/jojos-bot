var os = require('os');
const Discord = require('discord.js');

module.exports = {
    commands: ['host-stats', 'host-stat', 'hs'],
    maxArgs: 0,
    callback: (message, arguments) => {
        console.log(((Math.ceil(255 * (os.totalmem() - os.freemem()) / (os.totalmem()))) << 16 | (Math.ceil(255 - (255 * (os.totalmem() - os.freemem()) / (os.totalmem())))) << 8) & 0xFFFF00);
        const help = new Discord.MessageEmbed()
            .setColor(((Math.ceil(55 + 400 * (-0.5 + (os.totalmem() - os.freemem()) / (os.totalmem())))) << 16 | (Math.ceil(255 - (400 * (-0.5 + ((os.totalmem() - os.freemem()) / (os.totalmem())))))) << 8) & 0xFFFF00)
            .setTitle('Current state of machine:')
            .setDescription(
                'Operating system: ' + os.platform().toString() + '\n' + 
                'Memory used: ' + ((os.totalmem() / Math.pow(1024, 3) - os.freemem() / Math.pow(1024, 3))).toFixed(2) + ' GB/' +
                (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + ' GB (' + ((os.totalmem() - os.freemem()) / (os.totalmem()) * 100).toFixed(0) + '%)'
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        message.channel.send(help);
    }
}