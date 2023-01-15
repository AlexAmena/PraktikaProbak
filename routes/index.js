var express = require('express');
var router = express.Router();

/* LOGIN PAGE */
router.get('/', function (req, res, next) {
  if(!req.session.userid){
    res.render('login', {
      errorea: ''
    });
  }
  else {
    res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  }
});

/* REGISTER PAGE */
router.get('/register', function (req, res, next) {
  res.render('register', {
    errorea: ''
  });
});
router.post('/register', function (req, res, next) {
  res.redirect('/register')
});

/* LOGOUT */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});
module.exports = router;
