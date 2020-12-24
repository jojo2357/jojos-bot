const Manager = require('./scum-game-manager');

module.exports = {
    commands: ['join'],
    minArgs: 0,
    maxArgs: 0,
    restrictedToUsers: [],
    callback: (message, arguments) => {
        if (!Manager.getGames()[0].addPlayer(message.author))
            message.reply('Sorry, the game is already in progress or you are already there');
        else
            message.reply("got it");
    }
}