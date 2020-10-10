const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['show-all', 'all-games'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var out = "      #,  turns, player";
        var gameNum = 0;
        for (var gamedex = 0; gamedex < Manager.allGames().length; gamedex++){
            if (!message.guild.channels.cache.get(Manager.allGames()[gamedex].channel.id)) { 
                continue;
            }
            out += "\nGame  " + gameNum + ":  " + Manager.allGames()[gamedex].turnNumber + "    " + Manager.allGames()[gamedex].players[0] + " in <#" + Manager.allGames()[gamedex].channel + ">";
            gameNum++;
        }
        if (gameNum == 0)
            out = "There are no games going on in this server!\nUse `=connect-4` to start one!";
        const ch = new Discord.MessageEmbed()
            .setColor('#0cc0b4')
            .setTitle('Connect 4 games in progress')
            .setDescription(out)
            .setTimestamp();
        message.channel.send(ch);
    }
}