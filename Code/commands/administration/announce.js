const { existsSync } = require('fs');

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

        /*var guildList =*/
        client.guilds.cache.forEach(guild => {
            if (!existsSync('./assets/server-settings/' + guild.id + '.json'))
                return;
            let channelSettings = require(process.cwd() + '/assets/server-settings/' + guild.id + '.json');
            if (channelSettings.notifications) {
                if (client.channels.cache.get(channelSettings.notificationChannel) != undefined)
                    client.channels.cache.get(channelSettings.notificationChannel).send(moosage);
                return;
            }
        });
    }
}