module.exports = {
    tournaments: [],

    userIsHost(userID){
        for (var i = 0; i < this.tournaments.length; i++){
            if (this.tournaments[i].owner.id == userID)
                return true;
        }
        return false;
    }
}