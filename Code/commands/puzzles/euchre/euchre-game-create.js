const euchreGame = require("./euchre-game");
const euchreManager = require("./euchre-game-manager");
const os = require('os');

module.exports = {
    commands: ['euchre'],
    minArgs: 4,
    maxArgs: 4,
    callback: (message, arguments) => {
        if (message.author.id != '524411594009083933' && message.author.id != '777008421940887583')
            return;
        if (os.platform().toString().toLowerCase().includes('win')){
            message.reply("I'm sorry but im just a pi, i cant do that stuff just yet");
            return;
        }
        var failed = false;
        arguments.forEach(arg => {
            if (arg != 'cpu'){
                if (arg.includes('<'))
                    if (arg.indexOf('!') >= 0)
                        message.client.users.cache.find(user => user.id == arg.substring(3, arg.indexOf(">"))).send("Lets play some euchre! (You are getting this because the only way to test if i can message you is just to do it :/)").catch(err => {
                            message.reply('Failed to send a message to someone :(');
                            failed = true;
                        });
                    else
                        message.client.users.cache.find(user => user.id == arg.substring(2, arg.indexOf(">"))).send("Lets play some euchre! (You are getting this because the only way to test if i can message you is just to do it :/)").catch(err => {
                            message.reply('Failed to send a message to someone :(');
                            failed = true;
                        });
                else
                    message.client.users.cache.find(user => user.id == arg).send("Lets play some euchre! (You are getting this because the only way to test if i can message you is just to do it :/)").catch(err => {
                        message.reply('Failed to send a message to someone :(');
                        failed = true;
                    });
            }
        });
        if (failed) return;
        var game = new euchreGame.EuchreGame(arguments);
        euchreManager.addGame(game);
    }
}