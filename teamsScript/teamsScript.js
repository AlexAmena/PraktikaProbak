const fs = require('fs');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['teams'])

let ligakoId = 564

const ligenId = [140, 39, 135, 61, 78]

async function lortuJokalariak() {
    /*
    Lortu jokalariak
    */
    /*const data = fs.readFileSync('../../app/public/frontEnd/json/fullplayers.json', 'utf8');
    let players = []
    players = JSON.parse(data)

    //Ligen id-ak lortu
    ligakoTaldeenIdak = []
    for (let i = 0; i < players.length; i++) {
        if (players[i].leagueId == ligakoId) {
            if (ligakoTaldeenIdak.indexOf(players[i].teamId) == -1) {
                ligakoTaldeenIdak.push(players[i].teamId)
            }
        }
    }*/



    fetch(`https://v3.football.api-sports.io/status`, {
                    headers: {
                        "x-rapidapi-host": "v3.football.api-sports.io",
                        "x-rapidapi-key": "2db5b3fed11de422f2bbefa720c4ff4d"
                    }
                }).then(r => r.json()).then(r => r.response).then(r=> console.log(r))


    //id berriak mapeatu
    const data2 = JSON.parse(fs.readFileSync('../../app/public/frontEnd/json/fullLaLiga.json', 'utf8'));
    idBerriak = []
    let kopurua = data2.length
    let indizea=0;
    async function lortuInfo() {
        if (kopurua < 10) {
            for (let i = indizea; i < kopurua; i++) {
                let ekipoa = await fetch(`https://v3.football.api-sports.io/teams?id=${data2[i].newId}`, {
                    headers: {
                        "x-rapidapi-host": "v3.football.api-sports.io",
                        "x-rapidapi-key": "2db5b3fed11de422f2bbefa720c4ff4d"
                    }
                }).then(r => r.json()).then(r => r.response).then(r => gordeEkipoa(r))
            }
        }
        else {
            kopurua = kopurua - 10
            for (let i = indizea; i < 10; i++) {
                console.log(data2[i].newId)
                let ekipoa
                await fetch(`https://v3.football.api-sports.io/teams?id=${data2[i].newId}`, {
                    headers: {
                        "x-rapidapi-host": "v3.football.api-sports.io",
                        "x-rapidapi-key": "2db5b3fed11de422f2bbefa720c4ff4d"
                    }
                }).then(r => r.json()).then(r => r.response).then(r => gordeEkipoa(r)).then(r => console.log('hola'))
            }
            indizea +=10;
            setTimeout(lortuInfo, 60000)
        }
    }

    //Informazioa lortu eta datu basean gordetzen du
    //await lortuInfo()


    //Ekipoak lortu
    console.log(data2)
    let interval = setInterval(ekipoakLortu, 6000)

    async function ekipoakLortu(){
        if(indizea<kopurua){
            await fetch(`https://v3.football.api-sports.io/teams?id=${data2[indizea].newId}`, {
                headers: {
                    "x-rapidapi-host": "v3.football.api-sports.io",
                    "x-rapidapi-key": "2db5b3fed11de422f2bbefa720c4ff4d"
                }
            }).then(r => r.json()).then(r => console.log(r)).then(r => r.response).then(r => gordeEkipoa(r))
            indizea++
        }
        else{
            clearInterval(interval)
        }
    }
    function gordeEkipoa(ekipoa) {
        console.log(ekipoa)
        db.teams.find({ id: ekipoa[0].team.id }, (err, result) => {
            if (result.length == 0) {
                db.teams.insert(ekipoa[0].team, (err, result) => {
                    if (err)
                        console.log(err)
                })
            }
      })
    }

    let ligak = [140, 39, 135, 61, 78]
    //lortuLigak()

    async function lortuLigak() {
        for (let i = 0; i < ligak.length; i++) {
            await fetch(`https://v3.football.api-sports.io/leagues?id=${ligak[i]}`, {
                headers: {
                    "x-rapidapi-host": "v3.football.api-sports.io",
                    "x-rapidapi-key": "2db5b3fed11de422f2bbefa720c4ff4d"
                }
            }).then(r => r.json()).then(r => r.response).then(r => gordeLiga(r))
        }
    }
    function gordeLiga(liga) {
        //Gorde liga DBan
        console.log(liga)
        db.leagues.find({ id: liga[0].league.id }, (err, result) => {
            if (result.length == 0) {
                db.leagues.insert(liga[0].league, (err, result) => {
                    if (err)
                        console.log(err)
                })
            }
        })

    }
}

lortuJokalariak()