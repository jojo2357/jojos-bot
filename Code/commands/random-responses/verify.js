module.exports = {
    setClient(klient) {
        client = klient;
    },
    
    commands: ['verify'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        message.channel.send('Only ' + (75 - client.guilds.cache.size) + ' servers more until that check mark!');
    }
}