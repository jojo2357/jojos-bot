//const Discord = require('discord.js');
const path = require('path');
const config = require('./config.json');
const fs = require('fs');
const os = require('os');
const baseFile = 'command-base.js'
const commandBase = require(`./commands/${baseFile}`);
const MusicDb = require('./commands/music/music-manager.js');
const C4Game = require('./commands/puzzles/connect-four/game/connect-4-game.js');
const Euchre = require('./commands/puzzles/euchre/euchre-game.js');
const Scum = require('./commands/puzzles/scum/scum-game.js');
const bruhlist = require('./util/bruhlist.js');
const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 100;
let client = new (require('discord.js-commando')).CommandoClient({
    owner: '524411594009083933',
    commandPrefix: config.prefix
});
const { sendNotification } = require('./util/sendNotifiaction.js');
const remoteConsole = require('./util/remoteConsole.js');

const sendUsers = [require('./commands/misc/count-users.js'),
require('./commands/misc/distribution.js'),
require('./commands/administration/restart.js'),
require('./commands/administration/announce.js'),
require('./commands/administration/suggest.js'),
require('./commands/puzzles/connect-four/game/connect-4-game.js'),
require('./commands/puzzles/scum/scum-game.js'),
require('./commands/random-responses/verify.js'),
require('./util/getUser.js'),
remoteConsole];

const murderKids = [
require('./commands/puzzles/connect-four/game/connect-4-game.js'),
require('./commands/puzzles/euchre/euchre-game.js')
];

process.on('uncaughtException', (err) => {
    sendNotification(['Caught Exception:', err]);
})

process.on('exit', () => {
    murderKids.forEach((kidHolder) => kidHolder.killChild());
})

const DBL = require("dblapi.js");
const express = require('express');

const app = express();
const server = require('http').createServer(app);
const dbl = new DBL(config.top_ggToken, { webhookAuth: config.top_ggWebhook, webhookServer: server });

dbl.webhook.on('ready', () => {
    console.log("listening")
});

//tysm @Militia21 😊. You NEED to put /dblwebhook at the end of the website otherwise use the other janky thing
dbl.webhook.on('vote', vote => {
    if (client.users.cache.find((person => vote.user == person.id))) {
        sendNotification(['A vote! 😊', client.users.cache.find((person => vote.user == person.id)).username + ' voted for us! tysm!']);
        console.log(client.users.cache.find((person => vote.user == person.id)).username + ' voted for us! tysm!');
    } else {
        sendNotification(['A vote! 😊', 'We got voted for! tysm!']);
        console.log('We got voted for! tysm!');
    }
    var votes = fs.readFileSync('./assets/vote-log/recent-votes.dat').toString().replace('\r', '').split('\n');
    votes.push(vote.user + '@' + Date.now());
    console.log(votes);
    votes = votes.filter(voteThing => 
        //console.log(Date.now() - parseInt(voteThing.split('@')[1]) <= 1000 * 3600 * 12);
        Date.now() - parseInt(voteThing.split('@')[1]) <= 1000 * 3600 * 12
    );
    fs.writeFileSync('./assets/vote-log/recent-votes.dat', votes.join('\n'));
});

//janky hacked, no /dblwebhook extension notificaion listener:
app.use(express.urlencoded());
app.use(express.json());

app.post('/', (req, res) => {
    if (client.users.cache.find((person => req.body.user == person.id))) {
        sendNotification(['A vote! 😊', client.users.cache.find((person => req.body.user == person.id)).username + ' voted for us! tysm!']);
        console.log(client.users.cache.find((person => req.body.user == person.id)).username + ' voted for us! tysm!');
    } else {
        sendNotification(['A vote! 😊', 'We got voted for! tysm!']);
        console.log('We got voted for! tysm!');
    }
});

//const exposeLocalHost = spawn(process.cwd() + "/assets/webhook-hosting/ngrok.exe", []);

server.listen(5055, () => {
    console.log('Listening');
});

//init:
client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    client.user.setActivity({ name: 'thinking about connect-4', status: 'dnd' });
    client.user.setAFK(false);
    //client.user.setActivity(new Discord.Presence(client, {status: 'dnd', name: 'thinking about connect-4'}))
    MusicDb.init();
    C4Game.init();
    Euchre.init(client);
    Scum.init();
    bruhlist.loadbruhList();
    console.log("Presence set!");
    setInterval(() => {
        if (!os.platform().toString().includes("win")) dbl.postStats(client.guilds.size);
    }, 1800000);

    remoteConsole.sendHostStatus();
    setInterval(() => {
        remoteConsole.sendHostStatus();
    }, 60000);
    
    if (config.remoteConsole) setInterval(() => {
        remoteConsole.sendConsoleUpdates();
    }, 3600000);
    console.log("Loggers set");
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

client.on("guildCreate", (guild) => {
    sendNotification(['Added to server', 'omgomgomgomgogm i got added to' + (guild.name).replace('\"', '').replace('\'', '') + '!!!'])
    client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log);
    console.log(`Joined new guild: ${guild.name} at ` + new Date().toTimeString().split(' ')[0]);
    if (guild.systemChannel != null)
        guild.systemChannel.send("Hey! thanks for adding me! You can use `=help` to see commands and how to get started.")
});

client.on("guildDelete", (guild) => {
    sendNotification(['Removed from server', 'sobsobsobsobsobsob 😭 i got removed from' + (guild.name).replace('\"', '').replace('\'', '') + '!!!'])
    client.user.setActivity('=connect-4 in ' + client.guilds.cache.size + ' servers').then(console.log);
    console.log(`Left guild: ${guild.name} at ` + new Date().toTimeString().split(' ')[0]);
    //if (fs.existsSync(process.cwd() + '/assets/server-settings/' + guild.id + '.json'))
    //fs.unlinkSync(process.cwd() + '/assets/server-settings/' + guild.id + '.json').then(console.log("Removed " + message.guild.id + '.json'))
});

client.login(config.token);

sendUsers.forEach(sendTo => sendTo.setClient(client))