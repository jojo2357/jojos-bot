const Discord = require('discord.js');
const fs = require('fs');

let defaultSettings = { notifications: false, notificationChannel: 0, timeout: 60000, responses: false };

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
        if (!fs.existsSync('./assets/server-settings/' + message.guild.id + '.json')) {
            fs.writeFileSync('./assets/server-settings/' + message.guild.id + '.json', JSON.stringify(defaultSettings));
        }
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
            default:
                message.reply("Could not find that setting");
        }
        fs.writeFileSync('./assets/server-settings/' + message.guild.id + '.json', JSON.stringify(existingSettings))
        const msg = new Discord.MessageEmbed()
            .setTitle('Server Settings')
            .setDescription('use =set to change a setting. Example: `=set recieves notifications true` or `=set notification channel #general`')
            .addFields(
                { name: 'Recieves Notifications', value: "This setting determines if you recieve notifications about bot restarts, new updates, and inter-server tournaments (coming soon)\n" + existingSettings.notifications },
                { name: 'Notification Channel', value: "Current notifications channel:\n" + (existingSettings.notificationChannel == 0 ? "not set" : "<#" + existingSettings.notificationChannel + ">") },
                { name: 'Random Responses', value: "This setting sets whether or not the bot responds to messages like `f` or `bruh`. is either `true` or `false`\n" + existingSettings.responses },
            );
        message.channel.send(msg);
    }
}