const { prefix } = require('../config.json')
const { spawn } = require('child_process');
const fs = require("fs");

let blacklisted = []
const validatePermissions = (permissions) => {
    const validPermissions = [
        'CREATE_INSTANT_INVITE',
        'KICK_MEMBERS',
        'BAN_MEMBERS',
        'ADMINISTRATOR',
        'MANAGE_CHANNELS',
        'MANAGE_GUILD',
        'ADD_REACTIONS',
        'VIEW_AUDIT_LOG',
        'PRIORITY_SPEAKER',
        'STREAM',
        'VIEW_CHANNEL',
        'SEND_MESSAGES',
        'SEND_TTS_MESSAGES',
        'MANAGE_MESSAGES',
        'EMBED_LINKS',
        'ATTACH_FILES',
        'READ_MESSAGE_HISTORY',
        'MENTION_EVERYONE',
        'USE_EXTERNAL_EMOJIS',
        'VIEW_GUILD_INSIGHTS',
        'CONNECT',
        'SPEAK',
        'MUTE_MEMBERS',
        'DEAFEN_MEMBERS',
        'MOVE_MEMBERS',
        'USE_VAD',
        'CHANGE_NICKNAME',
        'MANAGE_NICKNAMES',
        'MANAGE_ROLES',
        'MANAGE_WEBHOOKS',
        'MANAGE_EMOJIS',
    ]

    for (const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Unknown permission node "${permission}"`);
        }
    }
}

module.exports = (client, commandOptions) => {
    let {
        commands,
        expectedArgs = '',
        permissionError = 'You do not have permission to run this command.',
        minArgs = 0,
        maxArgs = null,
        permissions = [],
        requiredRoles = [],
        callback,
    } = commandOptions;

    if (typeof commands === 'string') {
        commands = [commands];
    }
    if (!commands) {
        return;
    }

    console.log(`Registering command "${commands[0]}"`);

    blacklisted = [];
    blacklisted = fs.readFileSync('assets/blacklist/blacklist.dat').toString().split('\r\n');
    for (var i = blacklisted.length - 1; i >= 0; i--) {
        if (blacklisted[i] === '') {
            blacklisted.splice(i, 1);
        }
    }
    console.log(blacklisted);

    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions];
        }
        validatePermissions(permissions);
    }

    // Listen for messages
    client.on('message', (message) => {
        if (message.author.bot)
            return;
        if (blacklisted.includes(message.author.id))
            return;
        const { member, content, guild } = message;

        for (const alias of commands) {
            const command = `${prefix}${alias.toLowerCase()}`
            if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {
                for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError);
                        return;
                    }
                }

                for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(
                        (role) => role.name === requiredRole
                    )

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You must have the "${requiredRole}" role to use this command.`);
                        return;
                    }
                }
                const arguments = content.split(/[ ]+/);
                arguments.shift();

                if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
                    message.reply(`Use ${prefix}${alias} ${expectedArgs}`);
                    return;
                }
                if (message.guild != null) {
                    console.log(message.author.username + " in " + message.guild.name + " asked for " + message.toString() + ' at ' + new Date().toTimeString().split(' ')[0]);
                } else
                    console.log(message.author.username + " in dm'd me and asked for " + message.toString() + ' at ' + new Date().toTimeString().split(' ')[0]);
                try {
                    var timeIn = new Date().getMilliseconds();
                    callback(message, arguments, arguments.join(' '), client);
                    console.log("Took " + new Date().getMilliseconds() + "ms to complete");
                } catch (err) {
                    message.reply('An error has occured: ' + err + '\n' + err.stack);
                }
                return;
            }
        }
    })
}