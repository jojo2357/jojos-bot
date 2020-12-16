const musick = require('./music-manager');

module.exports = {
    commands: ['refresh-songs', 'refresh-song'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        var old = musick.amtOfSongs();
        musick.init();
        message.channel.send('Reload complete. I now have ' + (musick.amtOfSongs() - old) + ' more song titles for a total of ' + musick.amtOfSongs() + ' titles');
    }
}