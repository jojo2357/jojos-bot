var games = [];

module.exports = {
    addGame(game){
        games.push(game);
        return games.length - 1;
    },

    getGame(index = 0){
        return games[index];
    },

    removeGame(game){
        games.splice(games.indexOf(game), 1);
    },

    usersGame(user){
        for (const game of games)
            if (game.players[0] == user)
                return game;
        return null;
    }
}