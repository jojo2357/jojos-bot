const { MessageEmbed } = require('discord.js');
const { readdirSync, readFileSync } = require('fs');

module.exports = {
    commands: ['hot', 'cold'],
    minArgs: 0,
    maxArgs: 0,
    callback: (message, arguments) => {
        var winners = [];
        var losers = [];
        readdirSync(process.cwd() + '/assets/connect-4/game-record').forEach(file => {
            if (file.includes('Brain'))
                return;
            //var otherThing = process.cwd() + '/assets/connect-4/game-record/' + file;
            //var thing = fs.openSync(process.cwd() + '/assets/connect-4/game-record/' + file).toString();
            const stuff = getStreak(readFileSync(process.cwd() + '/assets/connect-4/game-record/' + file).toString().split('\n'));
            if (stuff[1] == 'W')
                winners.push([stuff[0], file.split('.')[0]]);
            else if (stuff[1] == 'L')
                losers.push([stuff[0], file.split('.')[0]]);
        });
        winners.sort((a, b) => {
            if (a[0] < b[0]) return 1;
            if (a[0] > b[0]) return -1;
            return 0;
        });
        winners.splice(10);
        losers.sort((a, b) => {
            if (a[0] < b[0]) return 1;
            if (a[0] > b[0]) return -1;
            return 0;
        });
        losers.splice(10);
        var embed;
        if (message.content.includes("hot")) {
            var out = "Wins, player";
            winners.forEach(thing => out += '\n' + (thing[0] + "<@" + thing[1] + ">"));
            embed = new MessageEmbed()
                .setColor('#fff800')
                .setTitle('Whos on a hot streak:')
                .setDescription(out);
        } else {
            var out = "Losses, player";
            losers.forEach(thing => out += '\n' + (thing[0] + "<@" + thing[1] + ">"));
            embed = new MessageEmbed()
                .setColor('#fff800')
                .setTitle('Whos on a cold streak:')
                .setDescription(out);
        }
        message.channel.send(embed);
    }
}

function getStreak(playerGames) {
    var winningOrLosing;
    var botStreak = 0;
    for (var i = playerGames.length - 2; i >= 0; i--) {
        if (playerGames[i].substring(2).length > 9)
            continue;
        if (winningOrLosing == undefined)
            winningOrLosing = playerGames[i].substring(0, 1);
        if (playerGames[i].substring(0, 1) != winningOrLosing)
            break;
        botStreak++;
    }
    return [botStreak, winningOrLosing];
}