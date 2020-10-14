const Discord = require('discord.js')

module.exports = {
    commands: ['suggest', 'sgt', 'suggestion'],
    minArgs: 1,
    expectedArgs: '<message>',
    callback: (userMessage, arguments, text, client) => {
        client.users.cache.get('524411594009083933').send('<@' + userMessage.author + '> sent the following in <#' + userMessage.channel + '>:\n' + text);
        userMessage.reply("Thank you for your input");
    },
}