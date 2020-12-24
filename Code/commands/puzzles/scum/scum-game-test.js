const Manager = require('./scum-game-manager');

module.exports = {
    commands: ['send'],
    minArgs: 0,
    maxArgs: 1,
    restrictedToUsers: ['524411594009083933'],
    callback: () => {
        Manager.getGames()[0].sendHands();
    }
}