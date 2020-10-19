const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');

module.exports = {
    commands: ['sign-up'],
    minArgs: 0,
    callback: (message, arguments) => {
        if (!Manager.tournament.contains(message.author)){
            message.author.send("You have been signed up!").then(() => {
                Manager.tournament.addPlayer(message.author);
                console.log("Signed up");
            }).catch(() => {
                message.reply("Please enable dm's from members of this server so that I can message you!")
                return;
            })
//            Manager.tournament.addPlayer(message.author)
//            console.log("Signed up");
        }else{
            message.reply(" you were already registered")
        }
    }
}