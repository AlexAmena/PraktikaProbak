var express = require('express');
var router = express.Router();
var multer = require('multer')
const path = require('path')
var createError = require('http-errors');

const mongojs = require('mongojs')
const db = mongojs('mongodb://127.0.0.1:27017/footballdata', ['players'])
const { check, validationResult } = require('express-validator');
const createHttpError = require('http-errors');

//METODOA DESKOMENTATZEAZ GOGORATU
/*
ADMIN BAT DEN EDO EZ EGIAZTATU
*/
/*router.use(function (req, res, next) {
  if (req.session.admin) {
    next()
  }
  else {
    //ERROREA BIDALI (403, baimenik ez)
    errorHandler(req, res, 403)
  }
});*/

/*
MULTER MIDDLEWAREAK
*/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (cb) {
      console.log(cb)
    }
    cb(null, `./public/json/players/${req.body.id % 32}`)
  },
  filename: function (req, file, cb) {
    filename = req.body.id + ".png"
    console.log(filename)
    cb(null, filename)
  }
})

const uploadFilter = function (req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  if (extension == '.png') {
    cb(null, true)
  }
  else {
    cb(null, false)
  }
}
const upload = multer({ storage: storage, fileFilter: uploadFilter })



//METODO LAGUNTZAILE BATZUK

router.get('/getLeaguesAndTeams', (req, res) => {
  console.log('hola')
  db.allTeams.find({}, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      res.send(result)
    }
  })
})


/* GET players listing. */
router.get('/', function (req, res, next) {
  db.players.find({}, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      res.render('allPlayers', {
        players: result
      })
    }
  })
});

/*
JOKALARIA GEHITZEKO
*/
//Formularioa erakutsi
router.get('/add', (req, res) => {
  db.allTeams.find({}, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      res.render('newPlayer',
        {
          teams: result,
          inf: '',
          error: ''
        })
    }
  })
})
//Igo fitxategia
router.post("/add", upload.single('file'), (req, res, next) => {
  console.log(req.file)
  next()
})
//Egiaztapenak egiteko middlewarea
router.post(
  "/add",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isString()
      .withMessage("Izenak string bat izan behar du!!"),
    check("birthdate")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isDate()
      .withMessage("hori ez da data baten formatu zuzena!"),
    check("nationality")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isString()
      .withMessage("Nazionalitateak string bat izan behar du!!")
      .custom(async value => {
        //console.log('value: ' + value)
        let nationality = await findInDB(value)
        //let nationality = await db.players.findOne({ nationality: value }, (err, result) => {
        //console.log('result:')
        //console.log(result)
        if (!nationality) {
          console.log('ezdago')
          return Promise.reject()
        }
        else {
          console.log('badago')
          return Promise.resolve()
        }
      }),

check("teamId")
  .not()
  .isEmpty()
  .withMessage('Parametro guztiak bete behar dira!!')
  .isInt({ min: 0 })
  .withMessage("Team id-ak 0 baino handiagoa den zenbaki bat izan behar du!!"),
  check("position")
    .not()
    .isEmpty()
    .withMessage('Parametro guztiak bete behar dira!!')
    .isIn(['GK', 'DF', 'MF', 'FW'])
    .withMessage("Posizioak GK, DF, MF edo WF izan behar du!!"),
  check("number")
    .not()
    .isEmpty()
    .withMessage('Parametro guztiak bete behar dira!!')
    .isInt({ min: 1, max: 999 })
    .withMessage("Zenbakiak 1 eta 999 artean egon behar du (biak barne)!!"),
  check("leagueId")
    .not()
    .isEmpty()
    .withMessage('Parametro guztiak bete behar dira!!')
    .isInt({ min: 0 })
    .withMessage("Ligaren identifikatzaileak 0 edo handiagoa izan behar du!!"),
  ],
async (req, res, next) => {
  const error = await validationResult(req).formatWith(({ msg }) => msg);
  const hasError = !error.isEmpty();
  //console.log(req.body)
  console.log('erroreak egiaztatzen')
  if (hasError) {
    res.status(422).json({ error: error.array() });
  } else {
    next();
  }
}
);
//Validator-ekin egin ez diren egiaztapenak egin:

//id-a erabilita dagoen egiaztatu
router.post("/add", (req, res, next) => {
  //id-a ez dagoela:
  //console.log('seguimos')
  db.players.find({ id: parseInt(req.body.id) }, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      if (result.length == 0) {
        next()
      }
      else {
        db.allTeams.find({}, (err, result2) => {
          if (err) {
            console.log(err)
          }
          else {
            res.render('newPlayer',
              {
                teams: result2,
                inf: req.body,
                error: 'Id hori erabilita dago'
              })
          }
        })
      }
    }
  })
})
//ekipo horretan dorsal hori erabilita dagoen egiaztatu
router.post("/add", (req, res, next) => {
  //id-a ez dagoela:
  db.players.find({ teamId: parseInt(req.body.teamId), number: parseInt(req.body.number) }, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      if (result.length == 0) {
        next()
      }
      else {
        db.allTeams.find({}, (err, result2) => {
          if (err) {
            console.log(err)
          }
          else {
            res.render('newPlayer',
              {
                teams: result2,
                inf: req.body,
                error: 'Talde horretan dorsal hori ez dago libre'
              })
          }
        })
      }
    }
  })
})
//Jokalaria gorde DBan
router.post("/add", (req, res) => {
  let player = req.body
  player.id = parseInt(player.id)
  player.leagueId = parseInt(player.leagueId)
  player.teamId = parseInt(player.teamId)
  player.number = parseInt(player.number)
  db.players.insertMany(req.body, (err, result) => {
    if (err) {
      res.send(err)
    } else {
      //res.send(result)
      res.redirect(`./${player.id}`)
    }
  })
})

/*
JOKALARIA EDITATZEKO
*/
//Jokalari konkretuak editatzeko
router.post("/edit", upload.single('file'), (req, res, next) => {
  db.allTeams.find({}, (err, result2) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log('errorea')
      res.render('editPlayer',
        {
          teams: result2,
          inf: req.body,
          error: ''
        })
    }
  })
})


router.put(
  "/edit",
  [
    check("name")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isString()
      .withMessage("Izenak string bat izan behar du!!"),
    check("birthdate")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isDate()
      .withMessage("hori ez da data baten formatu zuzena!"),
    check("nationality")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isString()
      .withMessage("Nazionalitateak string bat izan behar du!!"),
    check("teamId")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isInt({ min: 0 })
      .withMessage("Team id-ak 0 baino handiagoa den zenbaki bat izan behar du!!"),
    check("position")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isIn(['GK', 'DF', 'MF', 'FW'])
      .withMessage("Posizioak GK, DF, MF edo WF izan behar du!!"),
    check("number")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isInt({ min: 1, max: 999 })
      .withMessage("Zenbakiak 1 eta 999 artean egon behar du (biak barne)!!"),
    check("leagueId")
      .not()
      .isEmpty()
      .withMessage('Parametro guztiak bete behar dira!!')
      .isInt({ min: 0 })
      .withMessage("Ligaren identifikatzaileak 0 edo handiagoa izan behar du!!"),
  ],
  async (req, res, next) => {
    const error = await validationResult(req).formatWith(({ msg }) => msg);
    const hasError = !error.isEmpty();
    console.log(req.body)
    if (hasError) {
      res.status(422).json({ error: error.array() });
    } else {
      next();
    }
  }
);

//Validator-ekin egin ez diren egiaztapenak egin:


//ekipo horretan dorsal hori erabilita dagoen egiaztatu
router.put("/edit", (req, res, next) => {
  //id-a ez dagoela:
  db.players.find({ teamId: parseInt(req.body.teamId), number: parseInt(req.body.number) }, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      console.log(result)
      console.log(req.body)
      if (result.length == 0 || (result.length == 1 && result[0].id == parseInt(req.body.id))) {
        console.log('hola')
        next()
      }
      else {
        db.allTeams.find({}, (err, result2) => {
          if (err) {
            console.log(err)
          }
          else {
            console.log('errorea')
            res.render('editPlayer',
              {
                teams: result2,
                inf: req.body,
                error: 'Talde horretan dorsal hori ez dago libre'
              })
          }
        })
      }
    }
  })
})
router.put("/edit", (req, res) => {
  console.log('IRITSI DA HONAINO')
  console.log(req.body)
  let player = req.body
  player.id = parseInt(player.id)
  player.leagueId = parseInt(player.leagueId)
  player.teamId = parseInt(player.teamId)
  player.number = parseInt(player.number)
  db.players.findAndModify({
    query: { id: parseInt(req.body.id) },
    update: { $set: player }
  },
    (err, result) => {
      if (err) {
        res.send(err)
      } else {
        console.log('TXIIIIIIIIIIIIII')
        console.log(result)
        db.allTeams.find({}, (err, result2) => {
          //res.redirect(`../players/${req.body.id}`)
          res.render('editPlayer', {
            teams: result2,
            inf: req.body,
            error: 'Aldaketa ondo egin da'
          })
        })
      }
    })
})


router.post("/edit/:id", (req, res) => {
  let player = req.body
  player.id = parseInt(player.id)
  player.leagueId = parseInt(player.leagueId)
  player.teamId = parseInt(player.teamId)
  player.number = parseInt(player.number)
  db.players.findAndModify({
    query: { id: parseInt(req.body.id) },
    update: { $set: player }
  },
    (err, result) => {
      if (err) {
        res.send(err)
      } else {
        res.redirect('/')
      }
    })
})

router.get("/edit/:id", (req, res) => {
  db.players.find({ id: parseInt(req.params.id) }, (err, result) => {
    if (err) {
      console.log(err)
    }
    else {
      db.allTeams.find({}, (err, result2) => {
        if (err) {
          console.log(err)
        }
        else {
          res.render('editPlayer',
            {
              teams: result2,
              inf: result[0],
              error: ''
            })
        }
      })
    }
  })
})

/*
JOKALARI KONKRETU BATEN ESKAERA
*/
//URL bitartez egiten bada eskaera
router.get("/:id", (req, res) => {
  let number = parseInt(req.params.id)
  if (isNaN(number)) {
    errorHandler(res, 400)
  }
  else {
    db.players.find({ id: number }, (err, result) => {
      if (err) {
        console.log(err)
      }
      else {
        if (result.length == 0) {
          res.render('playerNotFound')
        }
        else {
          console.log(result)
          res.render('getPlayer', {
            player: result[0]
          }
          )
        }
      }
    })
  }
})
/*
JOKALARI KONKRETU BAT EZABATZEKO
*/
//URL bidez egiteko
router.get("/remove/:id", (req, res) => {
  db.players.remove({ id: parseInt(req.params.id) }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      //Ondo ezabatu badu orduan eguneratu lista
      db.players.find({}, (err, result) => {
        if (err) {
          console.log(err)
        }
        else {
          res.redirect('../')
        }
      })
    }
  });
})

function errorHandler(req, res, errorCode) {
  //ERROREA BIDALI (400, eskaera ez da zuzena)
  err = createError(errorCode)
  // error handler
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
}

async function findInDB(query) {
  await db.players.findOne({nationality : query}, (err, result) => {
    console.log('result')
    console.log(result)
    return result
  })
}

module.exports = router;
