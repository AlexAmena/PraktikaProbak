// YOUR CODE HERE :  
// .... stringToHTML ....
import { stringToHTML, higher, lower } from "./fragments.js";
// .... setupRows .....
export { setupRows }
import { initState, getStats, successRate, updateStats } from "./stats.js";
// .... setupRows .....
import { stats, toggle, headless } from "./fragments.js";

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate','number']


let setupRows = function (game) {
    
    let [state, updateState] = initState('WAYgameState', game.solution.id)

    if (state != null) game.guesses = state.guesses

    function leagueToFlag(leagueId) {
        // YOUR CODE HER
        let map1 = new Map()
        map1.set(564, "es1")
        map1.set(8, "en1")
        map1.set(82, "de1")
        map1.set(384, "it1")
        map1.set(301, "fr1")
        return map1.get(leagueId)
    }


    function getAge(dateString) {
        // YOUR CODE HERE
        let date = new Date(dateString)
        let time = date.getTime()
        let actualDate = new Date()
        actualDate = actualDate.getTime()
        let age = Math.abs(actualDate - date)
        return (Math.floor((age * 0.001) / (60 * 60 * 24 * 365)))
    }

    let check = function (theKey, theValue) {
        // YOUR CODE HERE
        if (attribs.indexOf(theKey) != -1) {
            if (game.solution[theKey] == theValue) {
                return "correct"
            }
            else if (theKey != "birthdate" && theKey!="number")
                return "incorrect"
            else if(theKey=="birthdate"){

                let dif = compareAge(theValue, game.solution[theKey])
                if (dif < 0) {
                    return "higher"
                }
                else if (dif > 0) {
                    return "lower"
                }
                else return "correct"
            }
            else{
                if(theValue>game.solution[theKey]) return "lower"
                else return "higher"
            }
        }
        else {
            console.log("Atributu hori ez da existitzen!")
        }

    }
    function compareAge(date1, date2) {
        let d1 = getAge(date1)
        let d2 = getAge(date2)
        return (d1 - d2)
    }

    function unblur(outcome) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome == 'success') {
                    color = "bg-blue-500"
                    text = "Awesome"
                } else {
                    color = "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }

    function showStats(timeout) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }

    function setContent(guess) {
        let erantzuna = check("birthdate", guess.birthdate)
        let ikurra
        let numberIkurra
        if (erantzuna == "higher") ikurra = higher
        else if (erantzuna == "lower") ikurra = lower
        else ikurra = ""
        erantzuna = check("number", guess.number)
        if(erantzuna == "higher") numberIkurra = higher
        else if(erantzuna=="lower") numberIkurra = lower
        else numberIkurra=""
        return [
            `<img src="/json/nationalities/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="/json/leagues/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="/json/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${getAge(guess.birthdate)} ${ikurra}`,
            `${guess.number} ${numberIkurra}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/6 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }

    function resetInput() {
        // YOUR CODE HERE
        myInput.value = ""
        myInput.placeholder = `Guess ${game.guesses.length} of 8`
    }

    let getPlayer = function (playerId) {

        // YOUR CODE HERE  
        let players = game.players.filter(e => e.id == playerId)
        let player = players[0]
        return {
            "id": player.id,
            "name": player.name,
            "birthdate": player.birthdate,
            "nationality": player.nationality,
            "teamId": player.teamId,
            "position": player.position,
            "number": player.number,
            "leagueId": player.leagueId
        }

    }

    function gameEnded(lastGuess) {
        // YOUR CODE HERE
        return (lastGuess == game.solution.id || game.guesses.length == 8)
    }
    function success() {
        unblur('success')
        showStats()
    }
    function gameOver() {
        unblur('gameOver')
        showStats()
    }
    function gameFinished() {
        if (game.guesses.length >= 8 || game.guesses.indexOf(game.solution.id) != -1) {
            if (game.guesses.indexOf(game.solution.id) != -1) {
                success()
            }
            else
                gameOver()

            for(let i=0; i<game.guesses.length;i++){
                let guess = getPlayer(game.guesses[i])
                let content = setContent(guess)
                showContent(content,guess)
            }
            let interval = setInterval(e => {
                const datefns = window.datefns

                let kontagailua = document.getElementById("nextPlayer")
                const now = new Date();
                let tomorrow = new Date() 
                tomorrow.setDate(tomorrow.getDate() + 1)
                tomorrow.setHours(0)
                tomorrow.setMinutes(0)
                tomorrow.setSeconds(0)
                tomorrow.setMilliseconds(0)

                let temp = datefns.intervalToDuration({
                    start : now,
                    end : tomorrow
                })
                kontagailua.innerText = `${temp.hours}:${temp.minutes}:${temp.seconds}`
            }, 1000);
        }
    }
    resetInput()
    for(let i in game.guesses){
        let guess = getPlayer(game.guesses[i])
        let content = setContent(guess)
        showContent(content, guess)

    }
    gameFinished()
    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {

            updateStats(game.guesses.length);

            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }

            let interval = setInterval(e => {
                const datefns = window.datefns

                let kontagailua = document.getElementById("nextPlayer")
                const now = new Date();
                let tomorrow = new Date() 
                tomorrow.setDate(tomorrow.getDate() + 1)
                tomorrow.setHours(0)
                tomorrow.setMinutes(0)
                tomorrow.setSeconds(0)
                tomorrow.setMilliseconds(0)

                let temp = datefns.intervalToDuration({
                    start : now,
                    end : tomorrow
                })
                kontagailua.innerText = `${temp.hours}:${temp.minutes}:${temp.seconds}`
            }, 1000);

        }


        showContent(content, guess)

    }
}
