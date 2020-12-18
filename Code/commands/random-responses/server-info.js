module.exports = {
    commands: ['server-info'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        if (!message.guild)
            message.reply('No guild found');
        else
            message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount} (${message.guild.members.cache.filter(member => member.user.bot).size} bots)\nServer ID: ${message.guild.id}\nCreation date: ${message.guild.createdAt.toDateString()}`);
    }
}