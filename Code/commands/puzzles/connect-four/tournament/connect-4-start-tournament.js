const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');
const Tournament = require('./connect-4-tournament.js');

module.exports = {
    commands: ['begin'],
    minArgs: 2,
    expectedArgs: 'UTC time to start tournament at',
    callback: (message, arguments) => {
        if (message.author.id == '524411594009083933'){
            //Manager.tournament.createGames();
            var now = new Date();
            var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(arguments[0]), parseInt(arguments[1]), 0, 0) - now;
            if (millisTill10 < 0) {
                 millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
            }
            //Manager.tournament.push(new )
            setTimeout(Manager.tournament.delayedStart, millisTill10, Manager.tournament);
        }
    }
}