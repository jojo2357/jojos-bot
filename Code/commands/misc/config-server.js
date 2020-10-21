const Discord = require('discord.js');
const fs = require('fs');

let defaultSettings = {notifications: false, notificationChannel: 0, timeout: 60000}

module.exports = {
    commands: ['settings-help', 'server-settings'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        if (message.guild.ownerID != message.author.id){
            message.reply("You are not the owner of this server");
            return;
        }
        if (!fs.existsSync('./assets/server-settings/' + message.guild.id + '.json')){
            fs.writeFileSync('./assets/server-settings/' + message.guild.id + '.json', JSON.stringify(defaultSettings));
        }
        var thisServerSettings = require(process.cwd() + '/assets/server-settings/' + message.guild.id + '.json');
        const msg = new Discord.MessageEmbed()
        .setTitle('Server Settings')
        .setDescription('use =set to change a setting. Example: `=set recieves notifications true` or `=set notification channel #general`')
        .addFields(
            { name: 'Recieves Notifications', value: "This setting determines if you recieve notifications about bot restarts, new updates, and inter-server tournaments (coming soon). is either `true` or `false`\n" + thisServerSettings.notifications},
            { name: 'Notification Channel', value: "Current notifications channel:\n" + (thisServerSettings.notificationChannel == 0 ? "not set" : "<#" + thisServerSettings.notificationChannel + ">")},
        )
        message.channel.send(msg);
    }
}