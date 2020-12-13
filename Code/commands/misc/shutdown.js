module.exports = {
    commands: ['shutdown'],
    maxArgs: 0,
    callback: async (message) => {
        await message.channel.send('oh no!');
        if (message.author == '524411594009083933')
            process.exit(0);
        await message.channel.send('anyway');
    }
} 