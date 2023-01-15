//Honen bitartez fullLaLiga... eta fitxategi hauek guztietako informazioa mongodbn gordeko da, ondoren APIko comboboxetan erabili ahal izateko
const fs = require('fs');
const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['allTeams'])


async function gordeFitxategiak(){
   

    /*
    Gorde FullLa Liga... fitxategietako informazioa mongodb-n.
    */
   let fitxategiak = ['fullBundesliga', 'fullLaLiga','fullLigue1','fullPremiere','fullSerieA']
   fitxategiak.forEach(fitx =>{
    const data = fs.readFileSync(`../../app/public/frontEnd/json/${fitx}.json`, 'utf8');
    let teams = JSON.parse(data)
    db.allTeams.insert(teams, (err, result) => {
        if (err) {
          console.log(err)
        } else {
          //res.send(result)
          console.log(`${fitx} gordeta`)
        }
      })
   })
}

gordeFitxategiak()
