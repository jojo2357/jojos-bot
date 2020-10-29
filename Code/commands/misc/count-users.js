const Discord = require('discord.js');

let client

module.exports = {
    setClient(klient) {
        client = klient
    },

    commands: ['users'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        let uniques = 0
        let total = 0
        let checkedGuilds = []
        let countedUsers = []
        for (var i = 0; i < client.guilds.cache.size; i++) {
            client.guilds.cache.forEach((guild) => { 
                if (!checkedGuilds.includes(guild.id)) { 
                    guild.members.cache.forEach((user) => {
                        if (user.bot)
                            return
                        if (!countedUsers.includes(user.id)){
                            uniques++
                            countedUsers.push(user.id)
                        }
                        total++
                    })
                    checkedGuilds.push(guild.id)
                }
            })
        }
        message.channel.send('Unique users in all servers: ' + uniques + "\nTotal users including duplicates: " + total)
    }
}