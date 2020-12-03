const Discord = require('discord.js');
const Game = require('./connect-4-game.js');
const Manager = require('./connect-4-game-holder.js');

module.exports = {
    commands: ['show'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        if (Manager.usersGame('<@' + message.author + '>') != null)
            if (Manager.usersGame('<@' + message.author + '>').channel[Manager.usersGame('<@' + message.author + '>').turn - 1].id == message.channel.id)
                Manager.usersGame('<@' + message.author + '>').sysoutBoard();
            else
                message.reply("somethin sus, here's a suggestion: " + Manager.usersGame('<@' + message.author + '>').channel[Manager.usersGame('<@' + message.author + '>').players.indexOf('<@' + message.author + '>')])
        else
            message.channel.send("You don't have a game in progress! Use `=connect-4` to start one!");
    }
} 