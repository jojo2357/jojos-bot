module.exports = {
    commands: ['test'],
    minArgs: 0,
    restrictedToUsers: ['524411594009083933'],
    callback: (message, arguments) => {
        let unBan = arguments[0];
        message.guild.fetchBans().then(bans => {
            bans.forEach(banInfo => {
                if (banInfo.user.id == unBan){
                    console.log('unbanning' + banInfo.user.id);
                    message.guild.members.unban(banInfo.user);
                }
            })
        })
    } 
}