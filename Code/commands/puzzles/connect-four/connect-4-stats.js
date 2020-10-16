const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    commands: ['connect-4-stats', 'connect-4-stat'],
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
            if (shortAuthor == '699366687455051808'){
                for (var braneSize = 10000; braneSize <= 10000000; braneSize *= 10){
                    if (!fs.existsSync('./assets/connect-4/game-record/' + braneSize + '_computerBrain.dat'))
                        continue;
                    if (braneSize >= 1000000)
                        var title = braneSize.toFixed(0).substring(0, braneSize.toFixed(0).length - 6) + 'M'
                    else
                        var title = braneSize.toFixed(0).substring(0, braneSize.toFixed(0).length - 3) + 'K'
                    getAndPrint(braneSize + '_computerBrain', 'Record for bot brain sized ' + title, message)
                }
                return;
            }
            getAndPrint(shortAuthor, 'Connect 4 stats', message)
        } catch (err) {
            message.channel.send("An error has occured loading stats: " + err.message);
        }
    }
}

function getAndPrint(shortAuthor, title = 'Connect 4 stats', message){
    if (!fs.existsSync('./assets/connect-4/game-record/' + shortAuthor + '.dat'))
        return;
    var playerGames = fs.readFileSync('./assets/connect-4/game-record/' + shortAuthor + '.dat').toString().split('\n');
    var w = 0;
    var d = 0;
    var l = 0;
    var tot = 0;
    var playerMap = new Map();
    var mapKeys = []
    for (var i = 0; i < playerGames.length - 1; i++) {
        if (!playerMap.has(playerGames[i].substr(2))) {
            playerMap.set(playerGames[i].substr(2), [0, 0, 0]);
            mapKeys.push(playerGames[i].substr(2));
        }
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
                playerMap.get(playerGames[i].substr(2))[2]++
                l++;
        }
        tot++;
    }
    var out = "Opponent:   W/D/L";
    for (var i = 0; i < playerMap.size; i++) {
        if (!mapKeys[i].includes('>')){
            if (parseInt(mapKeys[i]) >= 1000000)
                var brainName = mapKeys[i].substring(0, mapKeys[i].length - 6) + 'M'
            else
                var brainName = mapKeys[i].substring(0, mapKeys[i].length - 3) + 'K'
            out += "\nBrain size " + brainName + ': ' + playerMap.get(mapKeys[i])[0] + '/' + playerMap.get(mapKeys[i])[1] + '/' + playerMap.get(mapKeys[i])[2];
        }else
            out += "\n" + mapKeys[i] + ': ' + playerMap.get(mapKeys[i])[0] + '/' + playerMap.get(mapKeys[i])[1] + '/' + playerMap.get(mapKeys[i])[2];
    }
    out += "\n-------------------------------";
    out += "\nLifetime record: " + w + '/' + d + '/' + l;
    out += "\nLifetime wr: " + (100 * w / tot).toFixed(2) + '%';
    const ch = new Discord.MessageEmbed()
        .setColor('#0cc0b4')
        .setTitle(title)
        .setDescription(out)
        .setTimestamp()
    message.channel.send(ch);
}