const scumGame = require("./scum-game");
const Manager = require('./scum-game-manager')

module.exports = {
    commands: ['scum'],
    minArgs: 0,
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: (message) => {
        const game = new scumGame.ScumGame(message.channel, message.author);
        game.dealCards();
        Manager.addGame(game);
    }
}