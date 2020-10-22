const Discord = require('discord.js');
const Manager = require('./connect-4-tournament-manager.js');
const Tournament = require('./connect-4-tournament.js');

module.exports = {
    commands: ['create'],
    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<local/global>',
    callback: (message, arguments) => {
        if (arguments[0] != 'local' && arguments[0] != 'global'){
            message.reply('You must use either `local` or `global` to set the scope of the new tournament');
            return;
        }
        if (arguments[0] == 'local'){
            message.reply("This isnt set up so try global for now")
            return
        }
        if (message.author.id != '524411594009083933'){
            message.channel.send("Sorry, but tournament generation is disabled! If u pay me big moneyz doh...")
            return;
        }
        if (Manager.userIsHost(message.author.id)){
            message.reply('You are already hosting a tournament!');
            return;
        }
        console.log('Creating tournament!')
        const tourney = new Tournament.tournament(message.author, arguments[0] == 'global');
        Manager.tournaments.push(tourney);
        message.channel.send("Created! Your ID is: " + message.author.id + ". Share it far and wide!")
    }
}