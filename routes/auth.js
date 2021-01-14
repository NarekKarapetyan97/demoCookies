const { Router } = require('express')
const passport = require('passport')

const rout = Router()

rout.post(
    '/login',

    passport.authenticate('local'),
    (req, res) => {
        res.sendStatus(200)
    }
)

module.exports = rout
