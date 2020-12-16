const Manager = require('./game/connect-4-game-holder.js');

module.exports = {
    commands: ['ff'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        var game = Manager.usersGame('<@' + message.author + '>');
        if (game == null){
            message.channel.send('You dont have a game!');
        }else{
            game.ggMessage(game.players.indexOf('<@' + message.author + '>'));
        }
    }
} 