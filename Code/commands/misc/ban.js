const Discord = require('discord.js');

module.exports = {
    commands: ['ban'],
    minArgs: 0,
    maxArgs: 2,
    callback: (message, arguments) => {
        if (message.author.id != "524411594009083933")
            return;
        const banning = message.mentions.members.first()
        banning.ban({reason: arguments[1]}).then(message.reply("No error!")).catch(console.log)
    }
}