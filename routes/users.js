var express = require('express');
var router = express.Router();

const DBRef = require('mongojs');
const db = DBRef('mongodb://127.0.0.1:27017/footballdata', ['users'])


router.post('/register', function (req, res) {
    let user = {
        username: req.body.username,
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        password: req.body.password,
        admin: false
    }
    db.users.insert(user, (err, result) => {
        if (err)
            res.send('Errorea erregistroa burutzean')
        else
            res.redirect('/')
    })
});

router.post('/login', function (req, res) {
    console.log(req.body)
    db.users.find({ username: req.body.username }, (err, result) => {
        if (err) {
            res.send('errorea')
        }
        else {
            console.log(result)
            if (result.length > 0) {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].password == req.body.password) {
                        req.session.userid = req.body.username;
                        req.session.admin = result[i].admin;
                        if(req.session.admin)
                            res.render('adminPanela')
                        else{
                            res.render('userPanela')
                        }
                    }
                    else {
                        res.render('login',{
                            errorea: 'Pasahitza ez da zuzena'
                        })
                    }
                }
            }
            else {
                res.render('login', {
                    errorea: 'Erabiltzaile izen hori ez da existitzen'
                })
            }
        }
    })
});

module.exports = router;
