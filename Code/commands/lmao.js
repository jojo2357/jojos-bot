let lol = ["laugh your brain cells oof.", "dont laugh too hard!", "lMaOofIeS", 'laugh my mama land off'];

module.exports = {
  name: 'lmao',
  descripition: 'lmao',
  execute(message, args) {
    message.channel.send(lol[Math.floor(Math.random() * lol.length)]);
  }
}