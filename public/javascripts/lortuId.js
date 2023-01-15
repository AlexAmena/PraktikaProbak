const fs = require('fs');

async function lortuId(id) {
    /*
    Gorde FullLa Liga... fitxategietako informazioa mongodb-n.
    */
    const data = fs.readFileSync(`../frontEnd/json/fullplayers.json`, 'utf8');
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

export {lortuId}