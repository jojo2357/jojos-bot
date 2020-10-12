const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    commands: ['connect-4-stats'],
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
                if (!mapKeys[i].includes('>'))
                    out += "\nBrain size " + mapKeys[i] + ': ' + playerMap.get(mapKeys[i])[0] + '/' + playerMap.get(mapKeys[i])[1] + '/' + playerMap.get(mapKeys[i])[2];
                else
                    out += "\n" + mapKeys[i] + ': ' + playerMap.get(mapKeys[i])[0] + '/' + playerMap.get(mapKeys[i])[1] + '/' + playerMap.get(mapKeys[i])[2];
            }
            out += "xxxxxxxxxxxxxxxxxxxxxxx";
            out += "\nLifetime record: " + w + '/' + d + '/' + l;
            out += "\nLifetime wr: " + (100 * w / tot) + '%';
            const ch = new Discord.MessageEmbed()
                .setColor('#0cc0b4')
                .setTitle('Connect 4 stats')
                .setDescription(out)
                .setTimestamp()
            message.channel.send(ch);
        } catch (err) {
            message.channel.send("An error has occured: " + err.message);
        }
    }
}