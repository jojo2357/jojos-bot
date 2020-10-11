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
const advancedPolls = require('./commands/misc/poll');
const mongo = require('./mongo');
const MusicDb = require('./commands/music/music-manager.js');
const { EventEmitter } = require('events');
 EventEmitter.defaultMaxListeners = 100
const client = new Commando.CommandoClient({
  owner: '541707279628763146',
  commandPrefix: config.prefix
})

client.on('ready', async () => {
  console.log('AN ERROR A DAY MAKES YOUR BRAIN GO AWAY!')
  MusicDb.init();
  client.registry.registerGroup[['misc', 'miscellaneous commands'], ['funny', 'funny and weird commands'], ['help', 'have a question or need help?'], ['puzzles', 'some fun games you can play']].registerDefaults().registerCommandsIn(path.join(_dirname, 'cmds'))

  await mongo().then((mongoose) => {
    try {
      console.log('Coneected?')
    } finally {
      mongoose.connection.close()
    }
  })
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

    case "poll":
      const Enbed = new Discord.MessageEmbed()
        .setColor('FF6341')
        .setDescription('-poll [the message you want the bot to output here]')
        .setTitle('How to use the command -poll');

      if (!args[1]) {
        message.channel.send(Enbed);
        break;
      }
      let msgArgs = args.slice(1).join(" ");
      message.channel.send("🗒️ " + "**" + msgArgs + "**").then(messageReaction => {
        messageReaction.react("👍");
        messageReaction.react("👎");
        message.delete({ timeout: 1000 });
      });
      break;
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
    case 'dog':
      dog(message);
  };

  function dog(message) {

    var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + "cute dogs",
      method: "GET",
      headers: {
        "Accept": "text/html",
        "User-Agent": "Chrome"
      }
    };

    request(options, function (error, response, responseBody) {
      if (error) {
        return;
      }

      $ = cheerio.load(responseBody);
      var links = $(".image a.link");
      var urls = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"));
      console.log(urls);

      if (!urls.length) {

        return;
      }
      message.channel.send(urls[Math.floor(Math.random() * urls.length)]);
    })
  }
});

//*join
client.on('message', async message => {
  if (!message.guild) return;

  if (message.content === '-join') {
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
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