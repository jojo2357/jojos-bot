const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const config = require(process.cwd() + '/config.json');
const client = new Discord.Client();

client.login(config.token);

module.exports = {
    commands: ['announce'],
    minArgs: 0,
    callback: (message, arguments) => {
        if (message.author.id != "524411594009083933")
            return;
        let moosage = arguments.join(' ');

        /*var guildList =*/ client.guilds.cache.forEach(guild => {

            if (channel != undefined){
                if (typeof channel.send === "function" && guild.id == 762070587102461953)
                    channel.send(moosage).catch((err) => console.log("An error has occurred sending to " + guild.name))
                else 
                    console.log("Could not send to " + guild.name)
            }
        });
        /*try {
            guildList.forEach((guild) => guild.defaultChannel.send(arguments.join(' ')));
        } catch (err) {
            console.log("Could not send message to " + guild.name);
        }*/
    }
}