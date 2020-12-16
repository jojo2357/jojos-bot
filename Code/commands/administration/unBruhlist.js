const { removebruhList } = require('../../util/bruhlist.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['unbruhlist', 'unbruh'],
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments) => {
        if (message.author != '524411594009083933')
            return;
        if (removebruhList(arguments[0]))
            message.reply('Successfully debruhlisted <@' + arguments[0] + '>');
        else
            message.reply('They not bruhlisted');
    }
}