const Discord = require('discord.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['restart'],
    maxArgs: 1,
    callback: async (message, arguments) => {
        if (message.author.id == '524411594009083933' || message.author.id == '777008421940887583') {
            if (!arguments[0] || os.platform().toString().toLowerCase().includes(arguments[0].toLowerCase())) {
                client.user.setActivity('Restarting, please wait');
                await message.channel.send('Hasta la pasta');
                await client.user.setAFK(true);
                process.exit(1);
            } else
                message.send("I am " + os.platform().toString() + "");
        } else
            await message.channel.send('In ur dreams sukers');
    }
}