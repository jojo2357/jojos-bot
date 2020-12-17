const { MessageEmbed } = require('discord.js');
const { existsSync, writeFileSync } = require('fs');
const prefixLibrary = require('./../../util/customPrefixes.js');

let defaultSettings = { notifications: false, notificationChannel: 0, timeout: 60000, responses: false, prefix: require('./../../config.json').prefix };

module.exports = {
    commands: ['set'],
    minArgs: 3,
    maxArgs: 3,
    expectedArgs: 'Setting Name value',
    callback: (message, arguments) => {
        if (message.guild.ownerID != message.author.id && message.author.id != '524411594009083933' && message.author.id != '356955460521164820') {
            message.reply("You are not the owner of this server");
            return;
        }
        if (!existsSync('./assets/server-settings/' + message.guild.id + '.json')) {
            writeFileSync('./assets/server-settings/' + message.guild.id + '.json', JSON.stringify(defaultSettings));
        }
        var refreshMap = false;
        var existingSettings = require(process.cwd() + '/assets/server-settings/' + message.guild.id + '.json');
        //var existingSettings = fs.readFileSync('./assets/server-settings/' + message.guild.id + '.json').toJSON
        switch ((arguments[0] + ' ' + arguments[1]).toLowerCase()) {
            case 'recieves notifications':
                existingSettings.notifications = arguments[2].toLowerCase() == 'true'
                break;
            case 'notification channel':
                if (arguments[2].indexOf('#') > 0) {
                    existingSettings.notificationChannel = arguments[2].substring(2, arguments[2].indexOf('>'))
                    existingSettings.notifications = true;
                }
                break;
            case 'random responses':
                existingSettings.responses = arguments[2].toLowerCase() == 'true'
                break;
            case 'server prefix':
                refreshMap = true;
                if (arguments[2].length != 1) {
                    message.reply('My prefix must be one single character! Give me money or something and i can let u do other things');
                    return;
                }
                existingSettings.prefix = arguments[2];
                break;
            default:
                message.reply("Could not find that setting");
        }
        existingSettings = assertComplete(existingSettings);
        writeFileSync('./assets/server-settings/' + message.guild.id + '.json', JSON.stringify(existingSettings))
        if (refreshMap)
            prefixLibrary.updateMap();
        const msg = new MessageEmbed()
            .setTitle('Server Settings')
            .setDescription('use =set to change a setting. Example: `=set recieves notifications true` or `=set notification channel #general`')
            .addFields(
                { name: 'Recieves Notifications', value: "This setting determines if you recieve notifications about bot restarts, new updates, and inter-server tournaments (coming soon)\n" + existingSettings.notifications },
                { name: 'Notification Channel', value: "Current notifications channel:\n" + (existingSettings.notificationChannel == 0 ? "not set" : "<#" + existingSettings.notificationChannel + ">") },
                { name: 'Random Responses', value: "This setting sets whether or not the bot responds to messages like `f` or `bruh`. is either `true` or `false`\n" + existingSettings.responses },
                { name: 'Server Prefix', value: "The prefix of course! `=` by default\n" + existingSettings.prefix },
            );
        message.channel.send(msg);
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