import { folder, leftArrow } from "./fragments.js";
import { fetchJSON } from "./loaders.js";
import {setupRows} from "./rows.js"
import {autocomplete} from "./autocomplete.js"



function differenceInDays(date1) {
  // YOUR CODE HERE
  let o1 = date1.getTime()
  let date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  let o2 = date.getTime()
  let em = Math.abs(o2-o1)
  em = (em*0.001)/(60*60*24)
  return (parseInt(em))
}

let difference_In_Days = differenceInDays(new Date("08-18-2022"));

window.onload = function () {
  document.getElementById(
    "gamenumber"
  ).innerText = difference_In_Days.toString();
  document.getElementById("back-icon").innerHTML = folder + leftArrow;
};

let game = {
  guesses: [],
  solution: {},
  players: [],
  leagues: []
};


function getSolution(players, solutionArray, difference_In_Days) {
 
  // YOUR CODE HERE 
  let player = solutionArray[(difference_In_Days-1)%solutionArray.length]  
  for(let i = 0; i<players.length; i++){
    if(players[i].id==player.id) {
      return players[i]
    }
  }
}

Promise.all([fetchJSON("fullplayers"), fetchJSON("solution")]).then(
  (values) => {

    let solution;
    
    [game.players, solution] = values;

    game.solution = getSolution(game.players, solution, difference_In_Days);
    

    document.getElementById(
      "mistery"
    ).src = `/json/players/${
      game.solution.id % 32
    }/${game.solution.id}.png`;


      // YOUR CODE HERE
      autocomplete(document.getElementById("myInput"), game)
  }
);

