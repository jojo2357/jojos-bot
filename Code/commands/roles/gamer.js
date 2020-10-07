module.exports = {
    commands: 'gamer',
    minArgs: 0,
    maxArgs: 0,
    callback(message, arguments) {
        let role = message.guild.roles.cache.find(r => r.name === "Gamer")

        if (message.member.roles.cache.some(r => r.name === "Gamer")) {
            message.channel.send('You already have the role Gamer');
        } else {
            message.channel.send('Here is the Gamer role. Enjoy!');
            message.member.roles.add(role);
        }
    }
}