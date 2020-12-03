let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['suggest', 'sgt', 'suggestion', 'bug'],
    minArgs: 1,
    expectedArgs: '<message>',
    callback: (userMessage, arguments) => {
        client.users.cache.get('524411594009083933').send('<@' + userMessage.author + '> sent the following in <#' + userMessage.channel + '>:\n' + arguments.join(' '));
        userMessage.reply("Thank you for your input");
    },
} 