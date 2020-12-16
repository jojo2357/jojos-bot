const { platform } = require('os');
const { killHostStatus } = require('../../util/remoteConsole.js');

module.exports = {
    commands: ['shutdown'],
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: async (message, arguments) => {
        await message.channel.send('oh no!');
        if (!arguments[0] || platform().toString().toLowerCase().includes(arguments[0]))
            killHostStatus().then(process.exit(0));
        else
            message.channel.send("I am " + platform().toString() + "");
    }
} 