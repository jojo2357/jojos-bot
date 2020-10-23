const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');
const Tournament = require('./connect-4-tournament.js');

module.exports = {
    commands: ['begin'],
    minArgs: 2,
    expectedArgs: 'PST time to start your tournament at. ex: =begin 15 30\nIt is currently ' + new Date().toTimeString().split(' ')[0],
    callback: (message, arguments) => {
        //if (message.author.id == '524411594009083933'){
            //Manager.tournament.createGames();
            var now = new Date();
            var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(arguments[0]), parseInt(arguments[1]), 0, 0) - now;
            if (millisTill10 < 0) {
                 millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
            }
            //Manager.tournament.push(new )
            let findID = message.author.id;
            for (var i = 0; i < Manager.tournaments.length; i++)
                if (Manager.tournaments[i].owner == message.author.id){
                    if (!Manager.tournaments[i].public && Manager.tournaments[i].hostServer.id != message.guild.id){
                        message.reply("Please start this private tournament where it was created");
                        return;
                    }
                    if (Manager.tournaments[i].queued){
                        message.reply("Cannot enqueue start as it is already scheduled");
                        return;
                    }
                    Manager.tournaments[i].queued = true;
                    Manager.tournaments[i].scheduledStartTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(arguments[0]), parseInt(arguments[1]), 0, 0).toTimeString();
                    setTimeout(Manager.tournaments[i].delayedStart, millisTill10, Manager.tournaments[i], message.channel);
                    message.reply('Successfully enqueued start for ' + new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(arguments[0]), parseInt(arguments[1]), 0, 0).toTimeString());
                    return;
                }
            message.reply(' I dont think that you have a tournament')
        //}
    }
}