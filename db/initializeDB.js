const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players'])
const fs = require('fs')
function initializeDB(){
    const data = fs.readFileSync('../../app/public/frontEnd/json/fullplayers.json', 'utf8');
    let players = []
    players = JSON.parse(data)
    console.log(players.length)
    for(let i = 0; i<players.length; i++){
        db.players.insert(players[i], (err, result) => {
            if (err) {
              console.log(`Error storing player ${i}`)
            } else {
                console.log(`Player ${i} stored`)
            }
          })
    }


    //Create admin user
    db.users.insert({
        username : 'admin',
        email: 'admin@gmail.com',
        name : 'admin',
        surname: 'admin',
        admin : true,
        password : 'admin'
    }, (err, result)=>{
        console.log('Admin stored')
    })
}
initializeDB()

//export {initializeDB}