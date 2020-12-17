module.exports = {
    commands: ['server-info'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nServer ID: ${message.guild.id}\nCreation date: ${message.guild.createdAt.toDateString()}`);
    }
}