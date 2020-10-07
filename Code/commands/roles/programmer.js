module.exports = {
    commands: 'programmer',
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        let role = message.guild.roles.cache.find(r => r.name === "Programmer")

        if (message.member.roles.cache.some(r => r.name === "Programmer")) {
            message.channel.send('You already have the role Programmer');
        } else {
            message.channel.send('Ah, here is the Programmer role. Enjoy!');
            message.member.roles.add(role);
        }
    }
}