module.exports = {
    commands: ['vote'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        message.channel.send('Pls vote for me at https://top.gg/bot/699366687455051808/vote');
    }
}