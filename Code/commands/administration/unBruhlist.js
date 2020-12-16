const bruhList = require('../../util/bruhlist.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['unbruhlist', 'unbruh'],
    minArgs: 1,
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        if (bruhList.removebruhList(arguments[0]))
            message.reply('Successfully debruhlisted <@' + arguments[0] + '>');
        else
            message.reply('They not bruhlisted');
    }
}