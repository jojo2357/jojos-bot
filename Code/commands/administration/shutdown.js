const { platform } = require('os');
const remoteConsole = require('../../util/remoteConsole.js');

module.exports = {
    commands: ['shutdown'],
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: async (message, arguments) => {
        await message.channel.send('oh no!');
        if (!arguments[0] || platform().toString().toLowerCase().includes(arguments[0])){
            await remoteConsole.killHostStatus();
            process.exit(0);
        } else
            message.channel.send("I am " + platform().toString() + "");
    }
} 