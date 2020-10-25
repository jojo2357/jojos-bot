const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    commands: ['connect-4-stats', 'connect-4-stat', 'c4-stat', 'c4-stats'],
    minArgs: 0,
    maxArgs: 1,
    callback: (message, arguments) => {
        try {
            if (arguments.length > 0) {
                var shortAuthor = "" + arguments[0];
                if (shortAuthor.indexOf('>') > 0) {
                    shortAuthor = shortAuthor.substr(3, 18);
                }
            } else {
                var shortAuthor = message.author.id;
            }
            if (!fs.existsSync('./assets/connect-4/game-record/' + shortAuthor + '.dat') && shortAuthor != '699366687455051808') {
                message.channel.send("Sorry but I couldn't find match hisotry for id: " + shortAuthor)
                return;
            }
            if (shortAuthor == '699366687455051808') {
                for (var braneSize = 10000; braneSize <= 10000000; braneSize *= 10) {
                    if (!fs.existsSync('./assets/connect-4/game-record/' + braneSize + '_computerBrain.dat'))
                        continue;
                    if (braneSize >= 1000000)
                        var title = braneSize.toFixed(0).substring(0, braneSize.toFixed(0).length - 6) + 'M'
                    else
                        var title = braneSize.toFixed(0).substring(0, braneSize.toFixed(0).length - 3) + 'K'
                    getAndPrint(braneSize + '_computerBrain', 'Record for bot brain sized ' + title, message)
                }
                getAndPrint("community", 'Community Brain', message)
                return;
            }
            getAndPrint(shortAuthor, 'Connect 4 stats', message)
        } catch (err) {
            message.channel.send("An error has occured loading stats: " + err.message);
        }
    }
}

function getAndPrint(shortAuthor, title = 'Connect 4 stats', message) {
    if (shortAuthor == "community") {
        if (!fs.existsSync('./assets/connect-4/game-record/0_computerBrain.dat'))
            return;
        var playerGames = fs.readFileSync('./assets/connect-4/game-record/0_computerBrain.dat').toString().split('\n');
    } else {
        if (!fs.existsSync('./assets/connect-4/game-record/' + shortAuthor + '.dat'))
            return;
        var playerGames = fs.readFileSync('./assets/connect-4/game-record/' + shortAuthor + '.dat').toString().split('\n');
    }
    var w = 0;
    var d = 0;
    var l = 0;
    var tot = 0;
    var playerMap = new Map();
    var mapKeys = []
    for (var i = 0; i < playerGames.length - 1; i++) {
        if (!playerMap.has(playerGames[i].substr(2))) {
            playerMap.set(playerGames[i].substr(2), [0, 0, 0, 0]);
            mapKeys.push(playerGames[i].substr(2));
        }
        playerMap.get(playerGames[i].substr(2))[3]++;
        switch (playerGames[i].charAt(0)) {
            case 'W':
                playerMap.get(playerGames[i].substr(2))[0]++;
                w++;
                break;
            case 'D':
                playerMap.get(playerGames[i].substr(2))[1]++;
                d++;
                break;
            case 'L':
                playerMap.get(playerGames[i].substr(2))[2]++;
                l++;
        }
        tot++;
    }
    var out = "Opponent:   W/D/L";
    for (var j = playerMap.size; j > 0 && playerMap.size > 0; j--) {
        var rec = 0;
        var recDex = -1;
        for (var i = 0; i < playerMap.size; i++) {
            if (playerMap.get(mapKeys[i])[3] > rec) {
                rec = playerMap.get(mapKeys[i])[3];
                recDex = i
            }
        }
        if (recDex == -1)
            break;
        if (!mapKeys[recDex].includes('>')) {
            if (parseInt(mapKeys[recDex]) >= 1000000) {
                var brainName = mapKeys[recDex].substring(0, mapKeys[recDex].length - 6) + 'M'
                out += "\nBrain size " + brainName + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
            } else
                if (parseInt(mapKeys[recDex]) == 0) {
                    var brainName = "Community Brain"
                    out += "\n" + brainName + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
                } else {
                    var brainName = mapKeys[recDex].substring(0, mapKeys[recDex].length - 3) + 'K'
                    out += "\nBrain size " + brainName + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
                }
        } else
            out += "\n" + mapKeys[recDex] + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
        playerMap.delete(mapKeys[recDex]);
        mapKeys.splice(recDex, 1);
    }
    out += "\n-------------------------------";
    if (shortAuthor == "community") {
        if (!fs.existsSync('./assets/connect-4/tournaments/game-record/0_computerBrain.dat'))
            return;
        var tourneyGames = fs.readFileSync('./assets/connect-4/tournaments/game-record/0_computerBrain.dat').toString().split('\n');
    } else {
        if (!fs.existsSync('./assets/connect-4/tournaments/game-record/' + shortAuthor + '.dat'))
            return;
        var tourneyGames = fs.readFileSync('./assets/connect-4/tournaments/game-record/' + shortAuthor + '.dat').toString().split('\n');
    }
    /*var w = 0;
    var d = 0;
    var l = 0;
    var tot = 0;*/
    var playerMap = new Map();
    var mapKeys = []
    for (var i = 0; i < tourneyGames.length - 1; i++) {
        if (!playerMap.has(tourneyGames[i].substr(2))) {
            playerMap.set(tourneyGames[i].substr(2), [0, 0, 0, 0]);
            mapKeys.push(tourneyGames[i].substr(2));
        }
        playerMap.get(tourneyGames[i].substr(2))[3]++;
        switch (tourneyGames[i].charAt(0)) {
            case 'W':
                playerMap.get(tourneyGames[i].substr(2))[0]++;
                w++;
                break;
            case 'D':
                playerMap.get(tourneyGames[i].substr(2))[1]++;
                d++;
                break;
            case 'L':
                playerMap.get(tourneyGames[i].substr(2))[2]++;
                l++;
        }
        tot++;
    }
    out += "\nTournament stats:";
    for (var j = playerMap.size; j > 0 && playerMap.size > 0; j--) {
        var rec = 0;
        var recDex = -1;
        for (var i = 0; i < playerMap.size; i++) {
            if (playerMap.get(mapKeys[i])[3] > rec) {
                rec = playerMap.get(mapKeys[i])[3];
                recDex = i
            }
        }
        if (recDex == -1)
            break;
        if (!mapKeys[recDex].includes('>')) {
            if (parseInt(mapKeys[recDex]) >= 1000000) {
                var brainName = mapKeys[recDex].substring(0, mapKeys[recDex].length - 6) + 'M'
                out += "\nBrain size " + brainName + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
            } else
                if (parseInt(mapKeys[recDex]) == 0) {
                    var brainName = "Community Brain"
                    out += "\n" + brainName + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
                } else {
                    var brainName = mapKeys[recDex].substring(0, mapKeys[recDex].length - 3) + 'K'
                    out += "\nBrain size " + brainName + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
                }
        } else
            out += "\n" + mapKeys[recDex] + ': ' + playerMap.get(mapKeys[recDex])[0] + '/' + playerMap.get(mapKeys[recDex])[1] + '/' + playerMap.get(mapKeys[recDex])[2];
        playerMap.delete(mapKeys[recDex]);
        mapKeys.splice(recDex, 1);
    }
    out += "\nLifetime record: " + w + '/' + d + '/' + l;
    out += "\nLifetime wr: " + (100 * w / tot).toFixed(2) + '%';
    out += "\nLifetime games: " + tot;
    const ch = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle(title)
        .setDescription(out)
        .setTimestamp()
    message.channel.send(ch);
}