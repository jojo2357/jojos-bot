const startTime = Date.now();

module.exports = {
    commands: ['uptime'],
    minArgs: 0,
    callback: (userMessage) => {
        const now = new Date();
        var diff = now - startTime;
        var out = Math.floor(diff / (3600 * 1000)) + ":";
        diff -= Math.floor(diff / (3600 * 1000)) * (3600 * 1000);
        if (Math.floor(diff / (60 * 1000)) < 10)
            out += "0";
        out += Math.floor(diff / (60 * 1000)) + ":";
        diff -= Math.floor(diff / (60 * 1000)) * (60 * 1000);
        if (Math.floor(diff / (1000)) < 10)
            out += "0";
        out += Math.floor(diff / (1000));
        userMessage.channel.send("I have been awake for " + out);
    },
} 