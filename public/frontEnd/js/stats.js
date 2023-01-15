export {initState, successRate,getStats,updateStats}

let initState = function(what, solutionId) { 

    // YOUR CODE HERE

    //Egiaztatu localStoragenen jadanik zerbait dagoen, ez badago, sortu 
    let storage = localStorage.getItem(what)
    if(storage==null){
        localStorage.setItem(what, JSON.stringify({ 
            "guesses" : [],
            "solution": solutionId
        }));
        storage = localStorage.getItem(what)
    }
    storage = JSON.parse(storage)

    //storage-ko elementua beste egun bateko partidakoa bada berrabiarazi:
    if(storage.solution!=solutionId){
        localStorage.setItem(what, JSON.stringify({ 
            "guesses" : [],
            "solution": solutionId
        }));
        storage = localStorage.getItem(what)
        storage = JSON.parse(storage)
    }
    //Sortu array bat emaitza itzultzeko eta hor sartu beharrezko informazioa
    let itzultzekoArray = []
    itzultzekoArray[0] = storage

    itzultzekoArray[1] = function(guess){
        let storage = JSON.parse(localStorage.getItem(what))
        storage.guesses.push(guess)
        localStorage.setItem(what, JSON.stringify(storage))
    }
    return itzultzekoArray
}


function successRate (e){
    // YOUR CODE HERE
    return parseInt(((e.totalGames-e.gamesFailed) / e.totalGames)*100)
}

let getStats = function(what) {
    // YOUR CODE HERE
    let stats = JSON.parse(localStorage.getItem(what))
    //ez bada existitzen sortu
    if(stats==null){
        stats = {
            "winDistribution": [0,0,0,0,0,0,0,0,0],
            "gamesFailed": 0,
            "currentStreak": 0,
            "bestStreak": 0,
            "totalGames": 0,
            "successRate": 0
        }
        localStorage.setItem(what, JSON.stringify(stats))
        stats = JSON.parse(localStorage.getItem(what))
    }
    return stats
};


function updateStats(t){
    // YOUR CODE HERE
    let stats = getStats('gameStats')
    stats.totalGames++
    if(t<8){ //jokoa irabazi
        stats.currentStreak++
        if(stats.currentStreak>stats.bestStreak) stats.bestStreak = stats.currentStreak
        stats.winDistribution[t]++
        
    }
    else{ //jokoa galdu
        stats.gamesFailed++
        stats.currentStreak=0
    }
    stats.successRate = successRate(stats)
    localStorage.setItem('gameStats', JSON.stringify(stats))
};


let gamestats = getStats('gameStats');



