const Manager = require('./scum-game-manager');

module.exports = {
    commands: ['give'],
    minArgs: 1,
    callback: (message, arguments) => {
        Manager.getGames()[0].onSetTradeCards(message, arguments);
    }
}