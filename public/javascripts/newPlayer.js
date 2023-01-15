import { fetchJSON } from "../frontEnd/js/loaders.js";



async function lortuId(id) {
    /*
    Gorde FullLa Liga... fitxategietako informazioa mongodb-n.
    */
    const data = await fetchJSON('fullplayers')
    console.log(data)
    data.forEach(player => {
        if (player.id == id) {
            error('Id hori erabilita dago!!')
            return false;
        }
        else {
            return true
        }
    })
}

//gordeFitxategiak()
let ligaIdMap = {
    "LaLiga": 564,
    "Bundesliga": 82,
    "Serie A": 384,
    "Premier League": 8,
    "Ligue1": 301
}
//BEktore honetan ekipoak eta beraien ideak gordeko dira (i posizioan taldea, eta i+1ean ida)
let ekipoakEtaIdeak = []

function error(msg) {
    document.getElementById("error").innerHTML += `${msg}<br>`
}
function validateForm() {
    document.getElementById("error").innerHTML = ''
    let valid = true;
    let keys = ["id", "name", "birthdate", "nationality", "birthdate", "leagueId", "teamId"]
    keys.forEach(key => {
        if (document.getElementById("form")[key].value == "") {
            error(`${key} is required`)
            valid = false;
        }
    })

    //Egiaztatu id hori duen jokalaririk ez dagoela
    if (!lortuId(document.getElementById('id'))) {
        valid = false
    }
    if (valid) {
        //Ligaren mapeoa egin
        let liga = document.getElementById('leagueId')
        let ligueNumber = ligaIdMap[liga.value]
        restartComboBox(liga)
        let option = document.createElement('option')
        option.innerText = ligueNumber
        liga.appendChild(option)

        //Ekipoaren mapeoa egin
        console.log(ekipoakEtaIdeak)
        let ekipoa = document.getElementById('teamId')
        let index = ekipoakEtaIdeak.indexOf(ekipoa.value)
        let id = ekipoakEtaIdeak[index + 2]
        restartComboBox(ekipoa)
        id = parseInt(id)
        option = document.createElement('option')
        option.innerText = id
        ekipoa.appendChild(option)
        document.getElementById("form").submit();
    }
}


window.onload = function () {
    document.getElementById("amaitu").addEventListener('click', validateForm)
    let selectedLeague = document.getElementById('leagueId');
    let teamsComboBox = document.getElementById('teamId')
    console.log(selectedLeague.children)

    //Ekipoak filtratu eta eventListenerra gehitu liga aldatzean ekipoa ere aldatzeko:
    //Hasierako listan talde izena eta bere ligaren ID-a gordeko dira
    let bundesligaTeams = []
    let laLigaTeams = []
    let serieATeams = []
    let premierLeagueTeams = []
    let ligue1Teams = []
    for (let i = 0; i < teamsComboBox.length; i = i + 3) {
        if (teamsComboBox[i + 1].value == 82) {
            bundesligaTeams.push(teamsComboBox[i].value)
        }
        else if (teamsComboBox[i + 1].value == 564) {
            laLigaTeams.push(teamsComboBox[i].value)
        }
        else if (teamsComboBox[i + 1].value == 301) {
            ligue1Teams.push(teamsComboBox[i].value)
        }
        else if (teamsComboBox[i + 1].value == 8) {
            premierLeagueTeams.push(teamsComboBox[i].value)
        }
        else {
            serieATeams.push(teamsComboBox[i].value)
        }
    }
    //bektore honetan gorde ondoren taldearen id-a zein den jakiteko
    //Kendu orain dagoena:
    for (let i = teamsComboBox.length - 1; i >= 0; i = i - 3) {
        if (i >= 2) {
            ekipoakEtaIdeak.push(teamsComboBox[i - 2].value)
            ekipoakEtaIdeak.push(teamsComboBox[i - 1].value)
            ekipoakEtaIdeak.push(teamsComboBox[i].value)
        }
        teamsComboBox[i].remove()
    }
    console.log("ekipoak eta ideak:")
    console.log(ekipoakEtaIdeak)
    //Sartu berriak:
    selectedLeague.addEventListener('change', (event) => {
        restartComboBox(teamsComboBox)
        let arrayToSet = []
        if (selectedLeague.value == 'LaLiga') {
            arrayToSet = laLigaTeams
            console.log('hey')
        }
        else if (selectedLeague.value == 'Bundesliga') {
            arrayToSet = bundesligaTeams
        }
        else if (selectedLeague.value == 'Ligue1') {
            arrayToSet = ligue1Teams
        }
        else if (selectedLeague.value == 'Premier League') {
            arrayToSet = premierLeagueTeams
        }
        else if (selectedLeague.value == 'Serie A') {
            arrayToSet = serieATeams
        }
        arrayToSet.forEach(team => {
            let option = document.createElement('option')
            option.innerText = team
            console.log(option)
            teamsComboBox.appendChild(option)
        })
    })
}
function restartComboBox(comboBox) {
    for (let i = comboBox.length - 1; i >= 0; i--) {
        comboBox[i].remove()
    }
}
