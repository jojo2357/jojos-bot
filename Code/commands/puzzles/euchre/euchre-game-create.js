const euchreGame = require("./euchre-game");
const euchreManager = require("./euchre-game-manager");

module.exports = {
    commands: ['euchre'],
    minArgs: 4,
    maxArgs: 4,
    callback: (message, arguments) => {
        if (message.author.id != '524411594009083933')
            return;
        var failed = false;
        arguments.forEach(arg => {
            if (arg != 'cpu')
                message.client.users.cache.find(user => user.id == arg).send("Lets play some euchre! (You are getting this because the only way to test if i can message you is just to do it :/)").catch(err => {
                    message.reply('Failed to send a message to someone :(');
                    failed = true;
                });
        });
        if (failed) return;
        var playerList = arguments.join(',').replace('cpu', ' ');
        while (playerList.includes('cpu'))
            playerList = playerList.replace('cpu', ' ');
        var game = new euchreGame.EuchreGame(playerList);
        euchreManager.addGame(game);
    }
}