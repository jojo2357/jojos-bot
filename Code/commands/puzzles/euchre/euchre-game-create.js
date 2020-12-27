const euchreGame = require("./euchre-game");
const euchreManager = require("./euchre-game-manager");

module.exports = {
    commands: ['euchre'],
    minArgs: 4,
    maxArgs: 4,
    restrictedToUsers: ['524411594009083933', '777008421940887583'],
    callback: (message, arguments) => {
        if (!euchreGame.successfulCompile){
            message.reply('Something went wrong in loading up the euchre game, sorry');
            return;
        }
        let failed = false;
        arguments.forEach(arg => {
            if (arg != 'cpu') {
                if (!arg.includes('789368852936917002') && !arg.includes('699366687455051808'))
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
        if (!failed) {
            var game = new euchreGame.EuchreGame(arguments, message.channel);
            euchreManager.addGame(game);
        }
    }
}