module.exports = {
    commands: 'privacy',
    maxArgs: 0,
    callback: (message) => {
        message.channel.send("This bot permanently records the following information:\n -For each connect-4 game, user ID and outcome (win/loss/tie) and opponent ID\
            \n-Server ID and server settings\
            \n-Suggestions are permanently recorded and cannot be deleted so careful what you say! I will not share any suggestions, however, unless there is an inherent risk of self harm, harming others, or other things that may be of concern to the community.\
            \n\nWhat the bot temporarially collects but then is lost after 24 hours:\
            \n-For each command, username of issuer, server name, and timestamp\
            \nWhen added to a new server, temporarilly records server name to be deleted after 1 hour\
            \n\nWhat the bot does NOT collect:\
            \n-Bot does not record any messages either permanently or temporarialy unless it is a command\
            \n-No usernames are saved. Only user ID. Should someone go looking through the game record, they would only be able to connect information back to individual discord users if they had all of the usernames which they likely do not.\
            \n\nShould you feel that this is an invasion of privacy, you have the right to never use this bot and then you will effectively be invisible as nothing you do will be recorded.\
            \nAll of the bot code is public on GitHub (type `=bot-info` for link)\
            \nI do not currently offer data deletion as it will be an easy way to skirt a loss and will ultimately damage the records of those who have won legitimately"
        );
    }
}