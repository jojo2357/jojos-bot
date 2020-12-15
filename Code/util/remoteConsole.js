const Discord = require('discord.js');
const os = require('os');

let client;
let lastHostStatus;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    recentData: [],
    startTime: new Date().getMilliseconds(),

    async killHostStatus(){
        lastHostStatus && await lastHostStatus.edit("Bot died");
    },

    async sendHostStatus() {
        const help = new Discord.MessageEmbed()
            .setColor(((Math.ceil(55 + 400 * (-0.5 + (os.totalmem() - os.freemem()) / (os.totalmem())))) << 16 | (Math.ceil(255 - (400 * (-0.5 + ((os.totalmem() - os.freemem()) / (os.totalmem())))))) << 8) & 0xFFFF00)
            .setTitle('Current state of machine:')
            .setDescription(
                'Operating system: ' + os.platform().toString() + '\n' +
                'Memory used: ' + ((os.totalmem() / Math.pow(1024, 3) - os.freemem() / Math.pow(1024, 3))).toFixed(2) + ' GB/' +
                (os.totalmem() / Math.pow(1024, 3)).toFixed(2) + ' GB (' + ((os.totalmem() - os.freemem()) / (os.totalmem()) * 100).toFixed(0) + '%)'
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        if (lastHostStatus) 
            lastHostStatus = await lastHostStatus.edit(help);
        else
            lastHostStatus = await client.users.cache.get('524411594009083933').send(help);
    },

    sendConsoleUpdates() {
        this.recentData.forEach(data =>
            client.users.cache.get('524411594009083933').send(data).then(msg => msg.delete({ timeout: 3600000 })).catch()
        );
    },
}