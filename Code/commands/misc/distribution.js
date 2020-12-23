const { MessageEmbed } = require("discord.js");

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['dist'],
    maxArgs: 0,
    callback: (message) => {
        let guildUsers = [];
        let max = 0;
        client.guilds.cache.forEach(guild => {
            guildUsers.push(guild.memberCount);
            max = Math.max(max, guild.memberCount);
        });
        var out = "```size range | # of servers"
        for (var i = 1; Math.pow(10, i - 1) < max; i++) {
            let guildWithSize = 0;
            guildUsers.forEach(users => {
                if (users > Math.pow(10, i - 1) && users <= Math.pow(10, i))
                    guildWithSize++;
            })
            out += `\n${(" ").repeat(12 - (`${Math.pow(10, i - 1) + 1}, ${Math.pow(10, i)}`).length)}${Math.pow(10, i - 1) + 1}, ${Math.pow(10, i)} | ${guildWithSize}`;
        }
        out += "```"
        const outMsg = new MessageEmbed()
            .setColor('#fff800')
            .setTitle('Distribution of servers by size:')
            .setDescription(out)
            .setTimestamp()
            .setFooter('');
        message.channel.send(outMsg)
    }
}

