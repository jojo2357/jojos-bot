const { MessageEmbed } = require('discord.js');
const { existsSync, writeFileSync} = require('fs');
const prefixManager = require('../../util/customPrefixes.js');

let defaultSettings = { notifications: false, notificationChannel: 0, timeout: 60000, responses: false, prefix: require('../../config.json').prefix }

module.exports = {
    commands: ['settings-help', 'server-settings'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        var prefex;
        if (message.guild != undefined)
            prefex = prefixManager.get(message.guild.id);
        else
            prefex = prefixManager.get('default');
        if (!existsSync('./assets/server-settings/' + message.guild.id + '.json'))
            writeFileSync('./assets/server-settings/' + message.guild.id + '.json', JSON.stringify(defaultSettings));
        var thisServerSettings = require(process.cwd() + '/assets/server-settings/' + message.guild.id + '.json');
        thisServerSettings = assertComplete(thisServerSettings);
        const msg = new MessageEmbed()
            .setTitle('Server Settings')
            .setDescription('use ' + prefex + 'set to change a setting. Example: `' + prefex + 'set recieves notifications true` or `' + prefex + 'set notification channel #general`')
            .addFields(
                { name: 'Recieves Notifications', value: "This setting determines if you recieve notifications about bot restarts, new updates, and inter-server tournaments (coming soon). is either `true` or `false`\n" + thisServerSettings.notifications },
                { name: 'Notification Channel', value: "Current notifications channel:\n" + (thisServerSettings.notificationChannel == 0 ? "not set" : "<#" + thisServerSettings.notificationChannel + ">") },
                { name: 'Random Responses', value: "This setting sets whether or not the bot responds to messages like `f` or `bruh`. is either `true` or `false`\n" + thisServerSettings.responses },
                { name: 'Server Prefix', value: "The prefix of course! `=` by default\n" + thisServerSettings.prefix },
            )
        message.channel.send(msg);
        writeFileSync(process.cwd() + '/assets/server-settings/' + message.guild.id + '.json', JSON.stringify(thisServerSettings));
    }
}

function assertComplete(jsonSettings) {
    if (jsonSettings.notifications == undefined)
        jsonSettings.notifications = defaultSettings.notifications;
    if (jsonSettings.notificationChannel == undefined)
        jsonSettings.notificationChannel = defaultSettings.notificationChannel;
    if (jsonSettings.responses == undefined)
        jsonSettings.responses = defaultSettings.responses;
    if (jsonSettings.prefix == undefined)
        jsonSettings.prefix = defaultSettings.prefix;
    return jsonSettings;
}