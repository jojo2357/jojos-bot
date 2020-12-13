const Discord = require('discord.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['restart'], 
    minArgs: 0,
    maxArgs: 0,
    callback: async (message, arguments) => {
        if (message.author.id == '524411594009083933' || message.author.id == '777008421940887583'){
            client.user.setActivity('Restarting, please wait');
            await message.channel.send('Hasta la pasta');
            await client.user.setAFK(true);
            process.exit(1);
        }
        await message.channel.send('In ur dreams sukers');
    }
}