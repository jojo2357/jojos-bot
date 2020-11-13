const Discord = require('discord.js');
const Commando = require('discord.js-commando');
const path = require('path');
const ms = require("ms");
const { ping } = require('minecraft-server-util');
const { prefix } = require('./config.json');
const config = require('./config.json');
const fs = require('fs');
const { startsWith } = require('ffmpeg-static');
const cheerio = require('cheerio');
const request = require('request');
const baseFile = 'command-base.js'
const commandBase = require(`./commands/${baseFile}`);
const mongo = require('./mongo');
const MusicDb = require('./commands/music/music-manager.js');
const C4Game = require('./commands/puzzles/connect-four/game/connect-4-game.js');
const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 100
let client = new Commando.CommandoClient({
    owner: '524411594009083933',
    commandPrefix: config.prefix
})
const { spawn } = require('child_process');
const sendUsers = [require('./commands/misc/count-users.js'), 
require('./commands/misc/distribution.js'), 
require('./commands/misc/restart.js'),
require('./commands/misc/announce.js'),
require('./commands/puzzles/connect-four/game/connect-4-game.js')];

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('thinking about connect-4');
    MusicDb.init();
    C4Game.init();
    console.log("Presence set!");
});

const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir));
    for (const file of files) {
        const stat = fs.lstatSync(path.join(__dirname, dir, file));
        if (stat.isDirectory()) {
            readCommands(path.join(dir, file));
        } else if (file !== baseFile) {
            const option = require(path.join(__dirname, dir, file));
            commandBase(client, option);
        }
    }
}

readCommands('commands');

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
}

client.on("guildCreate", (guild) => {
    spawn('sendNotification.bat', ['Added to server', 'omgomgomgomgogm i got added to' + (guild.name).replace('\"', '').replace('\'', '') + '!!!'])
    client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log);
    console.log(`Joined new guild: ${guild.name}`);
    if (guild.systemChannel != null)
        guild.systemChannel.send("Hey! thanks for adding me! You can use `=help` to see commands. Use `=settings-help` to get started configuring the bot to recieve notifications")
});

client.on("guildDelete", (guild) => {
    spawn('sendNotification.bat', ['Removed from server', 'sobsobsobsobsobsob 😭 i got removed from' + (guild.name).replace('\"', '').replace('\'', '') + '!!!'])
    client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log);
    console.log(`Left guild: ${guild.name}`);
    //if (fs.existsSync(process.cwd() + '/assets/server-settings/' + guild.id + '.json'))
    //fs.unlinkSync(process.cwd() + '/assets/server-settings/' + guild.id + '.json').then(console.log("Removed " + message.guild.id + '.json'))
});

client.login(config.token);

module.exports = {
    setReady() {
        console.log('We are off and racing');
        client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers');
    }
}

sendUsers.forEach(sendTo => sendTo.setClient(client))