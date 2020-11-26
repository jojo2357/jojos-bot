module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['server-info'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
}