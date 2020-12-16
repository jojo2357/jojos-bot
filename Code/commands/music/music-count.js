const { amtOfSongs } = require('./music-manager');

module.exports = {
    commands: ['song-count', 'sc'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        message.channel.send("I have " + amtOfSongs() + " titles loaded");
    }
}