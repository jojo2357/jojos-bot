const bruhlist = require('../../util/bruhlist.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['bruhlist', 'bruh'],
    minArgs: 1,
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        if (client.users.cache.find(user => user.id == arguments[0])) 
            if (bruhlist.addbruhList(arguments[0]))
                message.reply('they were already bruhlisted')
            else
                message.reply('I no longer take orders from <@' + arguments[0] + '>');
        else
            message.reply('could not find ' + args[0] + ' in my cache so to be safe i wont add them');
    }
}