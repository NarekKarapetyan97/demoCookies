const { Router } = require('express')
const passport = require('passport')

const rout = Router()

rout.post(
    '/login',

    passport.authenticate('local'),
    (req, res) => {
        console.log(req.user)
        res.sendStatus(200)
    }
)

module.exports = rout
