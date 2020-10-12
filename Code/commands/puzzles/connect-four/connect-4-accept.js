const Discord = require('discord.js');
const Manager = require('./connect-4-game-holder');

module.exports = {
    commands: ['accept'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        var challenges = Manager.beenChallenged('<@' + message.author + '>');
        if (challenges.length == 0){
            message.channel.send("you dont have any pending challenges!");
        }else if (challenges.length == 1){
            challenges[0].acceptGame();
        }else if (arguments[0]){
            for (var i = 0; i < challenges.length; i++){
                if (challenges[i].players[0] == '<@' + message.mentions.users.first() + '>'){
                    challenges[i].acceptGame();
                    return;
                }
            }
        }else{
            message.channel.send('I\'m so sorry, Mr. Popular, but you have too many challenges, please mention the challenger to specify which one to accept');
        }
    }
}