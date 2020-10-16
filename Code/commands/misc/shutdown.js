const Discord = require('discord.js');

module.exports = {
    commands: ['shutdown'],
    minArgs: 0,
    maxArgs: 0,
    callback: async (message, arguments) => {
        await message.channel.send('oh no!');
        if (message.author == '524411594009083933')
            process.exit();
        await message.channel.send('anyway');
    }
}