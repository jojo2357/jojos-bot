const bruhlist = require('./../../util/bruhlist.js');
const getUser = require('./../../util/getUser.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    commands: ['bruhlist', 'bruh'],
    minArgs: 0,
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        if (arguments.length > 0) {
            const bruhID;
            try {
                bruhID = getUser.getUserFromMention(arguments[0]).id;
            } catch (err) {
                console.log(err);
                message.reply('Invalid user');
                return;
            }
            if (bruhID)
                if (!bruhlist.addbruhList(bruhID))
                    message.reply('they were already bruhlisted')
                else
                    message.reply('I no longer take orders from <@' + bruhID + '>');
            else
                message.reply('could not find ' + bruhID + ' in my cache so to be safe i wont add them');
        } else {
            var bruhList = bruhlist.bruhListed;
            var out
            if (bruhList.length > 0) {
                out = "User";
                bruhList.forEach(bruh => out += "\n<@" + bruh + ">");
            } else
                out = "I like everyone!";
            message.channel.send(new MessageEmbed()
                .setTitle('Who I dont like')
                .setDescription(out)
                .setFooter('User count: ' + bruhList.length)
                .setTimestamp()
            );
        }
    }
}