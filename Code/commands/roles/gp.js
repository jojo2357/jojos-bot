module.exports = {
    commands: ['gp', 'getPinned'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        let role = message.guild.roles.cache.find(r => r.name === "Gets Pinner")

        if (message.member.roles.cache.some(r => r.name === "Gets Pinner")) {
            message.channel.send('You will be pinned when there is a something new.');
        } else {
            message.channel.send('Here, don\'t regret it! 🤣');
            message.member.roles.add(role);
        }
    }
}