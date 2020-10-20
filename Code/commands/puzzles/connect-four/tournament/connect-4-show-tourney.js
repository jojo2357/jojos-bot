const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');

module.exports = {
    commands: ['show-tourney', 'show-tournament'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var out = "Player, seed";
        Manager.tournament.seedPlayers();
        for (var i = 0; i < Manager.tournament.players.length; i++)
            out += '\n<@' + Manager.tournament.players[i].id + '>:  ' + (Manager.tournament.players[i].startingSeed + 1)
        const ch = new Discord.MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('Current homies')
            .setDescription(out)
            .setTimestamp()
            .setFooter('Haha, good luck! Brain is loading')
        message.channel.send(ch);
    }
}