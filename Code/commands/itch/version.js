const https = require('https');
const {MessageEmbed} = require('discord.js');
const {itchkey} = require('./../../config.json');

function makeRequest(KEY) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'itch.io',
            path: `/api/1/${KEY}/my-games`,
            method: 'GET'
        };
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);

            res.on('data', d => {
                process.stdout.write(d);
                resolve(d);
            });
        });

        req.on('error', error => {
            console.error(error);
            reject(error);
        });

        req.end();
    });
}

function makeVerReq(version) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'itch.io',
            path: `/api/1/x/wharf/latest?game_id=935092&channel_name=${version}`,
            method: 'GET'
        };
        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`);

            res.on('data', d => {
                process.stdout.write(d);
                resolve(d);
            });
        });

        req.on('error', error => {
            console.error(error);
            reject(error);
        });

        req.end();
    });
}

module.exports = {
    commands: ['jabg-version', 'jabg-v'],
    maxArgs: 0,
    callback: (message) => {
        makeRequest(itchkey).then(async (win) => {
            const {games} = JSON.parse(win.toString());
            const jabg = games.find(game => game.id === 935092);
            if ((await makeVerReq("windows_alpha")).toString() === '{"errors":["invalid game"]}')
                await message.channel.send(new MessageEmbed().setAuthor("jojo2357", 'https://cdn.discordapp.com/avatars/524411594009083933/1ff6d708ec60efe7a07882ec97f2951e.png?size=128').setTimestamp()
                    .setFooter("jojo's awesome boat game best game").setTitle("JABG stats").setURL("https://jojo2357.itch.io/desktop-boats")
                    .setDescription("This game is currently private so I can't find the live version"));
            else
                await message.channel.send(new MessageEmbed().setAuthor("jojo2357", 'https://cdn.discordapp.com/avatars/524411594009083933/1ff6d708ec60efe7a07882ec97f2951e.png?size=128').setTimestamp()
                    .setFooter("jojo's awesome boat game best game").setTitle("JABG stats").setURL("https://jojo2357.itch.io/desktop-boats")
                    .setDescription("[Get on itch](https://jojo2357.itch.io/desktop-boats)")
                    .addField("windows", (await makeVerReq("windows_alpha")).toString())
                    .addField("mac", (await makeVerReq("mac_alpha")).toString()));
        });
    }
};