var games = [];
var pending = [];

module.exports = {
    holdMyBeer: null,

    findGameWithUser(user){
        return games.filter(game => game.players.includes(user))[0];
    },

    getPending() {
        return pending;
    },

    allGames() {
        return games;
    },

    addGame(game) {
        games.push(game);
    },

    addPending(game) {
        pending.push(game);
    },

    getGame(index = 0) {
        return games[index];
    },

    removeGame(game) {
        games.splice(games.indexOf(game), 1);
    },

    getChallenges(user) {
        var out = [];
        for (var i = 0; i < pending.length; i++) {
            if (pending[i].players[1] == user) {
                out.push(pending[i]);
            }
        }
        return out;
    },

    allChallenges(user) {
        var out = [];
        for (var i = 0; i < pending.length; i++) {
            if (pending[i].players.indexOf(user) >= 0) {
                out.push(pending[i]);
            }
        }
        return out;
    },

    beenChallenged(user) {
        var out = [];
        for (var i = 0; i < pending.length; i++) {
            if (pending[i].players.indexOf(user) == 1) {
                out.push(pending[i]);
            }
        }
        return out;
    },

    usersGame(user) {
        for (var i = 0; i < games.length; i++)
            if (games[i].players.indexOf(user) >= 0) {
                return games[i];
            }
        return null;
    },

    makeLive(game) {
        pending.splice(pending.indexOf(game), 1);
        games.push(game);
    },

    declineGame(game) {
        pending.splice(pending.indexOf(game), 1);
    },
}