const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');

module.exports = {
    commands: ['sign-up'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        if (!Manager.tournament.contains(message.author) && !Manager.tournament.inProgress){
            message.author.send("You have been signed up!").then(() => {
                Manager.tournament.addPlayer(message.author);
                console.log("Signed up");
                message.channel.send("You are signed up! There are now " + Manager.tournament.players.length + " people signed up")
            }).catch(() => {
                message.reply("Please enable dm's from members of this server so that I can message you!")
                return;
            })
//            Manager.tournament.addPlayer(message.author)
//            console.log("Signed up");
        }else if (Manager.tournament.inProgress){
            message.reply(" its already in progress")
        }else{
            message.reply(" you were already registered")
        }
    }
}