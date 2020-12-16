module.exports = {
    commands: 'ping',
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        message.channel.send('Pinging...').then(sent => {
            sent.edit(`Pong! Took ${sent.createdTimestamp - message.createdTimestamp}ms!`)
        })
    }
}