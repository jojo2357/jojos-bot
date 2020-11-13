const Discord = require('discord.js');
const Game = require('./game/connect-4-game.js');
const Manager = require('./game/connect-4-game-holder.js');

module.exports = {
    commands: ['diff', 'difficulty', 'brain-status'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        const msg = new Discord.MessageEmbed()
            .setTitle("Connect-4 bot brains")
            .setDescription(
                "Brain    Loaded\n\
                `Community `" + (Game.brainSize() == 0 ? ':white_check_mark: ' + Manager.notgamesPlayed() + ' community games' : "❌ ") + '\n\
                `Easy      `' + (Game.brainSize() == 10000 ? ':white_check_mark:' : "❌ ") + '\n\
                `Medium    `' + (Game.brainSize() == 100000 ? ':white_check_mark:' : "❌ ") + '\n\
                `Hard      `' + (Game.brainSize() == 1000000 ? ':white_check_mark:' : "❌ ") + '\n\
                `Hardest   `' + (Game.brainSize() == 10000000 ? ':white_check_mark:' : "❌ ") + '\n\n\
                What do these mean?\n =q+a');
        message.channel.send(msg);
    }
}