const Discord = require('discord.js');

let client;

module.exports = {
    setClient(klient) {
        client = klient;
    },

    commands: ['users'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        let uniques = 0;
        let total = 0;
        let countedUsers = [];
        let serverMemberCounts = [];
        client.guilds.cache.forEach((guild) => {
            let thisCount = 0;
            guild.members.cache.forEach((user) => {
                if (user.bot)
                    return;
                thisCount++
                if (!countedUsers.includes(user.id)) {
                    uniques++;
                    countedUsers.push(user.id);
                }
                total++;
            })
            serverMemberCounts.push(thisCount);
        })
        message.channel.send('Unique users in all servers: ' + uniques + "\nTotal users including duplicates: " + total + "\nAverage: " + average(serverMemberCounts).toPrecision(4) + "\nStandard deviation: " + standardDeviation(serverMemberCounts).toPrecision(4) + "\n" +  (100 * normalcdf(average(serverMemberCounts), standardDeviation(serverMemberCounts), 0)).toPrecision(4) + "% of servers have a negative amount of users");
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

function sum(data){
    var sum = 0
    for (var i = 0; i < data.length; i++){
        sum += data[i]
    }
    return sum
}

function average(data) {
    return sum(data) /data.length
}

function normalcdf(mean, sigma, to) {
    var z = (to-mean)/Math.sqrt(2*sigma*sigma);
    var t = 1/(1+0.3275911*Math.abs(z));
    var a1 =  0.254829592;
    var a2 = -0.284496736;
    var a3 =  1.421413741;
    var a4 = -1.453152027;
    var a5 =  1.061405429;
    var erf = 1-(((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*Math.exp(-z*z);
    var sign = 1;
    if(z < 0)
    {
        sign = -1;
    }
    return (1/2)*(1+sign*erf);
}