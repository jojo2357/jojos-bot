const Discord = require('discord.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['ff'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var game = Manager.usersGame('<@' + message.author + '>');
        if (game == null){
            message.channel.send('You dont have a game!');
        }else{
            game.ggMessage(game.players[game.players.indexOf('<@' + message.author + '>') == 0 ? 1 : 0]);
        }
    }
}