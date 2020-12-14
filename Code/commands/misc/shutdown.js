const os = require('os');

module.exports = {
    commands: ['shutdown'],
    maxArgs: 1,
    callback: async (message, arguments) => {
        await message.channel.send('oh no!');
        if (message.author == '524411594009083933')
            if (!arguments[0] || os.platform().toString().toLowerCase().includes(arguments[0]))
                process.exit(0);
            else
                message.send("I am " + os.platform().toString() + "");
        else
            await message.channel.send('anyway');
    }
} 