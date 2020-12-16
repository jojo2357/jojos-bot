const { addbruhList } = require('../../util/bruhlist.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['bruhlist', 'bruh'],
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments) => {
        if (message.author != '524411594009083933')
            return;
        if (client.users.cache.find(user => user.id == arguments[0])) {
            addbruhList(arguments[0])
            message.reply('I no longer take orders from <@' + arguments[0] + '>');
        } else
            message.reply('could not find ' + args[0] + ' in my cache so to be safe i wont add them');
    }
}