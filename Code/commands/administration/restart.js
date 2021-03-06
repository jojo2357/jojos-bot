const { platform } = require('os');
const remoteConsole = require("../../util/remoteConsole.js");

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['restart'],
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933', '777008421940887583'],
    callback: async (message, arguments) => {
        if (!arguments[0] || platform().toString().toLowerCase().includes(arguments[0].toLowerCase())) {
            await client.user.setActivity('Restarting, please wait');
            await message.channel.send('Hasta la pasta');
            await client.user.setAFK(true);
            await remoteConsole.killHostStatus();
            process.exit(1);
        } else
            message.channel.send("I am " + platform().toString() + "");
    }
}