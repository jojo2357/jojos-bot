const Discord = require('discord.js')
const Commando = require('discord.js-commando')
const path = require('path')
const ms = require("ms");
const { ping } = require('minecraft-server-util');
const roleClaim = require('./commands/roles/claim-role')
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
const C4Game = require('./commands/puzzles/connect-four/connect-4-game.js');
const { EventEmitter } = require('events');
EventEmitter.defaultMaxListeners = 100
const client = new Commando.CommandoClient({
  owner: '524411594009083933',
  commandPrefix: config.prefix
})

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`);
  MusicDb.init();
  C4Game.init();
  client.user.setActivity('thinking about connect-4');
  console.log("Presence set!");
  //client.registry.registerGroup[['misc', 'miscellaneous commands'], ['funny', 'funny and weird commands'], ['help', 'have a question or need help?'], ['puzzles', 'some fun games you can play']].registerDefaults().registerCommandsIn(path.join(_dirname, 'cmds'))

  /*mongo().then((mongoose) => {
    try {
      console.log('Coneected?')
    } finally {
      mongoose.connection.close()
    }
  })*/
});

/*
!Red (!)
?Blue (?)
*Green (*)
^Yellow (^)
&Pink (&)
~Purple (~)
todo Orange (todo)
Grey (//)
*/

const readCommands = (dir) => {
  const files = fs.readdirSync(path.join(__dirname, dir))
  for (const file of files) {
    const stat = fs.lstatSync(path.join(__dirname, dir, file))
    if (stat.isDirectory()) {
      readCommands(path.join(dir, file))
    } else if (file !== baseFile) {
      const option = require(path.join(__dirname, dir, file))
      commandBase(client, option)
    }
  }
}

readCommands('commands')

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
}



// //*The poll command
client.on('message', message => {
  let args = message.content.substring(prefix.length).split(" ");
  switch (args[0]) {
    case 'mute':
      var person = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[1]));
      if (!person) return message.reply("Who is that?" + person + "Please give me a valid name next time!")

      let role = message.guild.roles.cache.find(r => r.name === "mute")

      if (!role) return message.reply("Couldn't find the mute role.")

      let time = args[2];

      if (!time) {
        return message.reply("You didnt specify a time!");
      }

      person.roles.remove(role.id);


      message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`)

      setTimeout(function () {

        person.roles.remove(role.id);
        console.log(role.id)
        message.channel.send(`@${person.user.tag} has been unmuted.`)
      }, ms(time));
      break;
  }
})


// todo more images or user can choose what images they want
// *images
client.on('message', message => {

  let args = message.content.substring(prefix.length).split(" ");
  switch (args[0]) {
  };

});

//*join
client.on('message', async message => {
  if (!message.guild) return;

  /*if (message.content === '-join') {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }*/
});

// client.on('message', message => {

//   const args = message.content.split(/ +/);
//   const command = args.shift().toLowerCase();
//   if (command === 'lol') {
//     client.commands.get('lol').execute(message, args);
//   } else if (command === 'lmao') {
//     client.commands.get('lmao').execute(message, args);
//   }
// });
client.login(config.token);

module.exports = {
  setReady() {
    console.log('We are off and racing');
    client.user.setActivity('=connect-4');
  }
}