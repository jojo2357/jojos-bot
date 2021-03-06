const { prefix, remoteConsole } = require('./../config.json');
const bruhList = require('./../util/bruhlist.js');
const prefixMap = require('./../util/customPrefixes.js');
const remoteLogger = require('./../util/remoteConsole.js');

let recentCommands = new Map();

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
        restrictedToUsers = [],//this is for admin only that should be hardcoded for safety
    } = commandOptions;

    if (typeof commands === 'string') {
        commands = [commands];
    }
    if (!commands) {
        return;
    }

    if (permissions.length) {
        if (typeof permissions === 'string') {
            permissions = [permissions];
        }
        validatePermissions(permissions);
    }

    console.log(`Registering command "${commands[0]}"`);

    // Listen for messages
    client.on('message', (message) => {
        var timeIn = new Date().getMilliseconds();
        if (message.author.bot || (message.guild && !(message.channel.permissionsFor(client.user.id).has("SEND_MESSAGES"))))
            return;
        if (bruhList.bruhListed.includes(message.author.id))
            return;
        const { member, content, guild } = message;

        var useThisPrefix = guild != undefined ? prefixMap.get(guild.id) : prefix;

        for (const alias of commands) {
            const command = `${useThisPrefix}${alias.toLowerCase()}`
            if (content.toLowerCase().startsWith(`${command} `) || content.toLowerCase() === command) {

                //Readd for perm
                /*for (const permission of permissions) {
                    if (!member.hasPermission(permission)) {
                        message.reply(permissionError);
                        return;
                    }
                }*/

                //Readd for role
                /*for (const requiredRole of requiredRoles) {
                    const role = guild.roles.cache.find(
                        (role) => role.name === requiredRole
                    )

                    if (!role || !member.roles.cache.has(role.id)) {
                        message.reply(`You must have the "${requiredRole}" role to use this command.`);
                        return;
                    }
                }*/
                const arguments = content.split(/[ ]+/);
                arguments.shift();
                if (restrictedToUsers && restrictedToUsers.length > 0 && !restrictedToUsers.includes(message.author.id)) {
                    message.channel.stopTyping();
                    return;
                }
                if (arguments.length < minArgs || (maxArgs !== null && arguments.length > maxArgs)) {
                    message.reply(`Use ${useThisPrefix}${alias} ${expectedArgs}`);
                    return;
                }
                if (message.guild != null)
                    console.log(message.author.username + " in " + message.guild.name + " asked for " + message.toString() + ' at ' + new Date().toTimeString().split(' ')[0]);
                else
                    console.log(message.author.username + " in dm'd me and asked for " + message.toString() + ' at ' + new Date().toTimeString().split(' ')[0]);
                if (remoteConsole)
                    remoteLogger.addRecentData(`<@${message.author.id}>:${message.toString()}`);
                if (recentCommands.has(message.author.id))
                    if (recentCommands.get(message.author.id) > 5){
                        bruhList.addbruhList(message.author.id);
                        message.reply('This is your last command, if you want to be unbruhlisted, contact my owner or wait to have permissions restored');
                        if (remoteConsole) 
                            remoteLogger.addRecentData(`I bruhlisted ${message.author.id}`);
                    }else{
                        recentCommands[message.author.id]++;
                        setTimeout((userId) => recentCommands[userId]--, 10000, message.author.id)
                    }
                else
                    recentCommands.set(message.author.id, 0);
                try {
                    message.channel.startTyping().then(
                        callback(message, arguments)
                    ).then(message.channel.stopTyping(true));
                    message.channel.stopTyping(true);
                    console.log("Took " + (new Date().getMilliseconds() - timeIn) + "ms to complete");
                } catch (err) {
                    message.channel.stopTyping();
                    var out = err.stack.toString().toLowerCase();
                    while (out.includes(process.cwd().toLowerCase()))
                        out = out.replace(process.cwd().toLowerCase(), '');
                    if (remoteConsole) {
                        remoteLogger.addRecentData(out);
                        remoteLogger.sendConsoleUpdates();
                    }
                    message.reply('An error has occured: ' + err + '\n' + out);
                    console.log("En error occuerd in " + (new Date().getMilliseconds() - timeIn) + "ms and had this to say:\n" + out);
                }
                return;
            }
        }
    })
}
