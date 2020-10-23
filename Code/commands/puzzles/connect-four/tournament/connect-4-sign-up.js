const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');
const { tournament } = require('./connect-4-tournament.js');

module.exports = {
    commands: ['sign-up'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: 'tournament id',
    callback: (message, arguments) => {
        var tournament;
        for (var i = 0; i < Manager.tournaments.length; i++) {
            if (Manager.tournaments[i].owner.id == arguments[0])
                tournament = Manager.tournaments[i];
        }
        if (tournament == undefined) {
            message.reply('Could not find a tournament with that id');
            return;
        }
        if (!tournament.public && tournament.hostServer.id != message.guild.id){
            console.log(tournament.hostServer.id + ' ' + message.guild.id)
            message.reply("Sorry, but that tournament is local to another server. Please navigate back to that server to sign up");
            return;
        }
        for (var i = 0; i < Manager.tournaments.length; i++) {
            for (var j = 0; j < Manager.tournaments[i].players.length; j++) {
                if (Manager.tournaments[i].players[j].id == message.author.id) {
                    message.reply(" you are already signed up for a tournament!")
                    return;
                }
            }
        }
        if (/*!tournament.players.contains(message.author) &&*/ !tournament.inProgress) {
            message.author.send("You have been signed up!").then(() => {
                tournament.addPlayer(message.author);
                console.log("Signed up");
                message.channel.send("You are signed up! There are now " + tournament.players.length + " people signed up")
            }).catch(() => {
                message.reply("Please enable dm's from members of this server so that I can message you!")
                return;
            })
            //            Manager.tournament.addPlayer(message.author)
            //            console.log("Signed up");
        } else if (tournament.inProgress) {
            message.reply(" its already in progress")
        } else {
            message.reply(" you were already registered")
        }
    }
}