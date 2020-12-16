const remoteConsole = require('./../../util/remoteConsole.js')

module.exports = {
    commands: ['remote-console'],
    minArgs: 0,
    maxArgs: 0,
    restrictedToUsers: ['524411594009083933'],
    callback: () => {
        remoteConsole.sendConsoleUpdates();
    }
}