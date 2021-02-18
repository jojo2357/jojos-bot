let client;

const a1 = 0.254829592;
const a2 = -0.284496736;
const a3 = 1.421413741;
const a4 = -1.453152027;
const a5 = 1.061405429;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['users'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message) => {
        var botCount = 0;
        var max = 0;
        var uniqueBots = 0;
        let uniques = 0;
        let total = 0;
        let countedUsers = [];
        let serverMemberCounts = [];
        client.guilds.cache.forEach((guild) => {
            let thisCount = 0;
            guild.members.cache.forEach((user) => {
                if (user.user.bot)
                    botCount++;
                thisCount++;
                if (!countedUsers.includes(user.id)) {
                    if (user.user.bot)
                        uniqueBots++;
                    uniques++;
                    countedUsers.push(user.id);
                }
                total++;
            })
            serverMemberCounts.push(thisCount);
            max = Math.max(max, thisCount);
        })
        message.channel.send('Unique users in all ' + client.guilds.cache.length + ' servers: ' + uniques + "\n" +
            "Total users including duplicates: " + total + "\n" +
            "Average: " + average(serverMemberCounts).toPrecision(4) + "\n" +
            "Standard deviation: " + standardDeviation(serverMemberCounts).toPrecision(4) + "\n"
            + (100 * normalcdf(average(serverMemberCounts), standardDeviation(serverMemberCounts), 0)).toPrecision(4) + "% of servers have a negative amount of users\n" +
            "Max: " + max + '\n' +
            'Median: ' + median(serverMemberCounts) + '\n' +
            'Bots: ' + botCount + ' (' + uniqueBots + ' unique bots)');
    }
}

function standardDeviation(values) {
    var avg = average(values);

    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
    });

    var avgSquareDiff = average(squareDiffs);

    var stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

function sum(data) {
    var sum = 0;
    data.forEach(thing => sum += thing);
    return sum;
}

function average(data) {
    return sum(data) / data.length
}

function normalcdf(mean, sigma, to) {
    var z = (to - mean) / Math.sqrt(2 * sigma * sigma);
    var t = 1 / (1 + 0.3275911 * Math.abs(z));
    var erf = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
    var sign = 1;
    if (z < 0) {
        sign = -1;
    }
    return (0.5) * (1 + sign * erf);
}

function median(data = [0]) {
    data.sort((a, b) => {
        if (a > b)
            return 1;
        if (a < b)
            return -1;
        return 0;
    });
    return (data[Math.floor((data.length - 1) / 2)] + data[Math.ceil((data.length - 1) / 2)]) / 2;
}