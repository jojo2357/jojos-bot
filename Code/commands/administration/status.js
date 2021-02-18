let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['status', 'rstat'],
    maxArgs: 0,
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers');
    }
}