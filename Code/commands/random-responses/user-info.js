module.exports = {
    commands: ['user-info', 'my-info'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
    }
}