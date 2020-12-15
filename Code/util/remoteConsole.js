const Discord = require('discord.js');
const os = require('os');
const fs = require('fs');

let client;
let lastHostStatus;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    startTime: new Date().getMilliseconds(),

    async killHostStatus(){
        lastHostStatus && await lastHostStatus.delete().catch();
        await this.sendConsoleUpdates();
    },

    async sendHostStatus() {
        const tot = os.totalmem();
        const free = os.freemem();
        const used = tot - free;
        const help = new Discord.MessageEmbed()
        .setColor(((Math.ceil(55 + 400 * (-0.5 + (used) / (tot)))) << 16 | (Math.ceil(255 - (400 * (-0.5 + ((used) / (tot)))))) << 8) & 0xFFFF00)
            .setTitle('Current state of machine:')
            .setDescription(
                'Operating system: ' + os.platform().toString() + '\n' + 
                'Memory used: ' + ((used / Math.pow(1024, 3))).toFixed(2) + ' GB/' +
                (tot / Math.pow(1024, 3)).toFixed(2) + ' GB (' + ((used) / (tot) * 100).toFixed(0) + '%)'
            ).setTimestamp()
            .setFooter('More commands coming soon!');
        if (lastHostStatus) 
            lastHostStatus = await lastHostStatus.edit(help);
        else
            lastHostStatus = await client.users.cache.get('524411594009083933').send(help);
    },

    async sendConsoleUpdates() {
        if (fs.readFileSync('recentData.dat').toString().length > 2000)
            await client.users.cache.get('524411594009083933').send(new Discord.MessageAttachment('recentData.dat'));
        else
            await client.users.cache.get('524411594009083933').send(fs.readFileSync('recentData.dat').toString());
        console.log('sent console updates');
        fs.unlinkSync('recentData.dat');
    },

    async addRecentData(data) {
        if (!fs.existsSync('recentData.dat'))
            fs.writeFileSync('recentData.dat', '');
        fs.appendFileSync('recentData.dat', data + '\n');
    }
}
