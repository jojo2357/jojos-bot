const Discord = require('discord.js');
const musick = require('./music-manager');

module.exports = {
    commands: ['cong-count', 'sc'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        message.channel.send("I have " + musick.amtOfSongs() + " titles loaded");
    }
}