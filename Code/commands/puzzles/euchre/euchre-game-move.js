const Manager = require('./euchre-game-manager.js');

module.exports = {
    commands: ['em'],
    minArgs: 1,
    maxArgs: 1,
    callback: (message, arguments) => {
        if (message.author.id != '524411594009083933' && message.author.id != '777008421940887583' && message.author.id != '219288357606391818' && message.author.id != '692187428491886664')
            return;
        const game = Manager.getGame();
        game.makeMove(message.author.id + ':' + arguments[0]);
    }
}