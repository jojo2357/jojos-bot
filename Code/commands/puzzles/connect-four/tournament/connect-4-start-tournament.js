const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');

module.exports = {
    commands: ['begin'],
    minArgs: 0,
    callback: (message, arguments) => {
        if (message.author.id == '524411594009083933')
            Manager.tournament.createGames();
    }
}