const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const config = require(process.cwd() + '/config.json');
const fs = require('fs');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['announce'],
    minArgs: 0,
    callback: (message, arguments) => {
        if (message.author.id != "524411594009083933")
            return;
        let moosage = arguments.join(' ');

        /*var guildList =*/ client.guilds.cache.forEach(guild => {
            if (!fs.existsSync('./assets/server-settings/' + guild.id + '.json'))
                return;
            let channelSettings = require(process.cwd() + '/assets/server-settings/' + guild.id + '.json');
            if(channelSettings.notifications){
                client.channels.cache.get(channelSettings.notificationChannel).send(moosage);
                return;
            }
        });
    }
}