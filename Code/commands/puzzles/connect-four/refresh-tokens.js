const Game = require('./game/connect-4-game.js')

module.exports = {
    commands: ['refresh-images'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        if (message.author.id == '524411594009083933')
            Game.initImages();
    }
}