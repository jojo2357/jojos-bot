const Discord = require('discord.js')
const channelId = '760640151402840114'
const thumbs_up = '👍'
const thumbs_down = '👎'

module.exports = {
  commands: ['suggest', 'sgt', 'suggestion'],
  minArgs: 1,
  expectedArgs: '<message>',
  callback: (userMessage, arguments, text, client) => {
    const { guild, member } = userMessage

    const channel = guild.channels.cache.get(channelId)
    channel
      .send(
        `A new suggestion has been created by <${member}>. Do you aggree? Vote now!
"${text}"`
      )
      .then((ticketMessage) => {
        ticketMessage.react(thumbs_up)
        ticketMessage.react(thumbs_down)
      })
  },
}