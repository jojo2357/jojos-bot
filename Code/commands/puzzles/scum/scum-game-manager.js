var games = []

module.exports = {
    addGame(game){
        games.push(game);
    },

    getGames(){
        return games;
    }
}