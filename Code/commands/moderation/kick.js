module.exports = {
  commands: 'kick',
  minArgs: 0,
  maxArgs: 1,
  permissions: 'ADMINISTRATOR',
  callback: (message, argguments) => {
    const user = message.mentions.users.first();
    if (user) {
      const member = message.guild.member(user);
      if (member) {
        member
          .kick('Do not break the rules! Please read the rules once you join this server. Thanks!')
          .then(() => {
            message.reply(`Successfully kicked ${user.tag}`);
          });
      } else {
        message.reply("That user isn't in this guild!");
      }
    } else {
      message.reply("You didn't mention the user to kick!");
    }
  }
}