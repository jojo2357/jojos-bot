const Discord = require('discord.js')

module.exports = {
    commands: ['utc'],
    minArgs: 0,
    callback: (userMessage, arguments, text, client) => {
        var now = new Date();
        userMessage.channel.send(now.getUTCHours() + ':' + now.getUTCMinutes())
    },
}