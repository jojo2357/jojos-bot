const bruhList = require('./../../util/bruhlist.js');
const getUser = require('./../../util/getUser.js');

module.exports = {
    commands: ['unbruhlist', 'unbruh'],
    minArgs: 1,
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        var bruhID;
        try {
            bruhID = getUser.getUserFromMention(arguments[0]).id;
        } catch (err) {
            console.log(err);
            message.reply('Invalid user');
            return;
        }
        if (bruhID && bruhList.removebruhList(bruhID))
            message.reply('Successfully debruhlisted <@' + bruhID + '>');
        else
            message.reply('They not bruhlisted');
    }
}