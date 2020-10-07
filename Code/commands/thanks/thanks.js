// const Commando = require('discord.js-commando')
// const thanksSchema = require('../../schemas/thanks-schema')

// module.exports = class ThanksCommand extends Commando.Command {
//     constructor(client) {
//         super(client, {
//             name: 'thank',
//             group: 'thanks',
//             memberName: 'thanks',
//             description: 'Thank someone for helping you'
//         })
//     }    

//     run = async (message) => {
//         const target = message.memtions.user.first()
//         if (!target) {
//             message.reply('Who do you want to tank?')
//             return
//         }
//         const { guild } = message
//         const targetId = target.id
//         const authorId = message.author.id
//         const now = new Date()

//         if (targetId === authorId) {
//             message.reply('Uh how do you thanks yourself. If you go buy a flower and someone asks who is it for, you say it\'s for you. See that makes no sensation.')
//             return
//         }

//         const authorData = await thanksSchema.findOne({
//             userId: authorId,
//             guildId
//         })

//         if (authorData && authorData.lastGave)

//         const diff = now.getTime - then.getTime()
//         const diffHours = Math.round(diff / (1000 * 60 * 60))

//         const hours = 12
//         if (diffHours <= hours) {
//             message.channel.send(`You have already thanked someone within ${hours} hours.`)
//             return
//         }
//     }
//     await thanksSchema.findByIdAndUpdate({
//         userId: authorId,
//         guildId,
//         lastGave: now
//     }, {
//         upsert: true
//     })

    
// }