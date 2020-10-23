const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');

module.exports = {
    commands: ['show-tourney', 'show-tournament', 'show-tournaments'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        if (arguments.length == 1){
            var tournament;
            for (var i = 0; i < Manager.tournaments.length; i++){
                if (Manager.tournaments[i].owner.id == arguments[0])
                    tournament = Manager.tournaments[i];
            }
            if (tournament == null){
                message.channel.send("An error has occured loading that tournament");
                return;
            }
            var out = "Player, seed";
            tournament.seedPlayers();
            for (var i = 0; i < tournament.players.length; i++)
                out += '\n<@' + tournament.players[i].id + '>:  ' + (tournament.players[i].startingSeed + 1)
            const ch = new Discord.MessageEmbed()
                .setColor('#0cc0b4')
                .setTitle('Current homies')
                .setDescription(out)
                .setTimestamp()
                .setFooter('Haha, good luck! Brain is loading')
            message.channel.send(ch);
        }else{
            var out = "Local/Global, # of players, owner username, tournament id, scheduled start time"
            for (var i = 0; i < Manager.tournaments.length; i++){
                if (Manager.tournaments[i].hostServer == null || Manager.tournaments[i].hostServer == undefined){
                    Manager.tournaments.splice(i, 1);
                    if (Manager.tournaments.length == i)
                        break;
                }
                if (!Manager.tournaments[i].public && message.guild.id == Manager.tournaments[i].hostServer.id)
                    out += '\nLocal:  ' + Manager.tournaments[i].players.length + ' players, ' + Manager.tournaments[i].owner.username + ' `' + Manager.tournaments[i].owner.id + '` ' + (Manager.tournaments[i].scheduledStartTime == undefined ? 'not set' : Manager.tournaments[i].scheduledStartTime);
                else if (Manager.tournaments[i].public)
                    out += '\nGlobal: ' + Manager.tournaments[i].players.length + ' players, ' + Manager.tournaments[i].owner.username + ' `' + Manager.tournaments[i].owner.id + '` ' + (Manager.tournaments[i].scheduledStartTime == undefined ? 'not set' : Manager.tournaments[i].scheduledStartTime);
            }
            const ch = new Discord.MessageEmbed()
                .setColor('#0cc0b4')
                .setTitle('Tournament List')
                .setDescription(out)
                .setTimestamp()
                .setFooter('Haha, good luck! Brain is loading')
            message.channel.send(ch);
        }
    }
}