var games = [];
var pending = [];

module.exports = {
    allGames(){
        return games;
    },

    addGame(game){
        games.push(game);
    },

    addPending(game){
        pending.push(game);
    },

    getGame(index = 0){
        return games[index];
    },

    removeGame(game){
        games.splice(games.indexOf(game), 1);
    },

    getChallenges(user){

    },

    usersGame(user){
        for (var i = 0; i < games.length; i++)
            if (games[i].players.indexOf(user) >= 0){
                return games[i];
            }
        return null;
    },

    makeLive(game){
        pending.splice(pending.indexOf(game), 1);
        games.push(game);
    },

    declineGame(game){
        pending.splice(pending.indexOf(game), 1);
    }
}