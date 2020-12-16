let client;

let uniques;
let total;
let countedUsers;
let serverMemberCounts;

let thisCount;

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
        uniques = 0;
        total = 0;
        countedUsers = [];
        serverMemberCounts = [];
        client.guilds.cache.forEach((guild) => {
            thisCount = 0;
            guild.members.cache.forEach((user) => {
                if (user.bot)
                    return;
                thisCount++;
                if (!countedUsers.includes(user.id)) {
                    uniques++;
                    countedUsers.push(user.id);
                }
                total++;
            })
            serverMemberCounts.push(thisCount);
        })
        message.channel.send('Unique users in all servers: ' + uniques + "\nTotal users including duplicates: " + total + "\nAverage: " + average(serverMemberCounts).toPrecision(4) + "\nStandard deviation: " + standardDeviation(serverMemberCounts).toPrecision(4) + "\n" + (100 * normalcdf(average(serverMemberCounts), standardDeviation(serverMemberCounts), 0)).toPrecision(4) + "% of servers have a negative amount of users");
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