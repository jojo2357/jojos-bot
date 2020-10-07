let lol = ["haha", "lmao", "What's funny?", "yas!", "Does your brain even have brain cells?", "I DARE YOU, BE STUPID.", "secret command: 'f in math", "laugh my lolipop out", "xD", "PLEASE, STOP IT, GET SOME LAUGHS", "what's funny you stupid muffin head", 'lol your lolipop oof', 'lOlLoLlOlLol'];

module.exports = {
  name: 'lol',
  descripition: 'random commands for when someone says lol.',
  execute(message, args) {

    message.channel.send(lol[Math.floor(Math.random() * lol.length)]);
  }
}