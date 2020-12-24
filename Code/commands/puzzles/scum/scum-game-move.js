const Manager = require('./scum-game-manager');

module.exports = {
    commands: ['move'],
    minArgs: 1,
    maxArgs: 2,
    callback: (message, arguments) => {
        Manager.getGames()[0].handleMessage(message, arguments);
    }
}