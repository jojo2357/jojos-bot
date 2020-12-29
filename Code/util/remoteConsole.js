const { MessageAttachment, MessageEmbed } = require('discord.js');
const { totalmem, freemem, platform } = require('os');
const fs = require('fs');

let client;
let lastHostStatus;
var lastMem = 0;

const btogb = Math.pow(1024, 3);

module.exports = {
    setClient(klient) {
        client = klient;
    },

    async killHostStatus() {
        lastHostStatus && !lastHostStatus.deleted && await lastHostStatus.delete().catch();
        await this.sendConsoleUpdates();
    },

    async sendHostStatus() {
        const tot = totalmem();
        const free = freemem();
        const used = tot - free;
        const help = new MessageEmbed()
            .setColor(((Math.ceil(55 + 400 * (-0.5 + (used) / (tot)))) << 16 | (Math.ceil(255 - (400 * (-0.5 + ((used) / (tot)))))) << 8) & 0xFFFF00)
            .setTitle('Current state of machine:')
            .setDescription(
                '```Operating system: ' + platform().toString() + '\n' +
                '     Memory used: ' + ((used / btogb)).toFixed(2) + ' GB/' +
                (tot / btogb).toFixed(2) + ' GB (' + (used / tot * 100).toFixed(0) + `% | ${used / tot * 100 > lastMem ? '+' : ''}${(used / tot * 100 - lastMem).toFixed(0)}%)` + '```').setTimestamp()
            .setFooter('More commands coming soon!');
        if (lastHostStatus && !lastHostStatus.deleted)
            lastHostStatus = await lastHostStatus.edit(help);
        else
            lastHostStatus = await client.users.cache.get('524411594009083933').send(help);
    },

    async sendConsoleUpdates() {
        if (!fs.existsSync('recentData.dat'))
            return;
        if (fs.readFileSync('recentData.dat').toString().length > 2000)
            await client.users.cache.get('524411594009083933').send(new MessageAttachment('recentData.dat'));
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
