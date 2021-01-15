const { Router } = require('express')
const passport = require('passport')
const redis = require('redis')

const rout = Router()

const publisher = redis.createClient()
const subscriber = redis.createClient()

rout.post(
    '/login',

    passport.authenticate('local'),
    (req, res) => {
        console.log(req.user)
        res.sendStatus(200)
    }
)

rout.get('/publisher', (req, res) => {
    publisher.publish('user-notify', JSON.stringify(req.user))
    res.send('Publishing an Event using Redis')
})

subscriber.on('message', (channel, message) => {
    console.log('Received data :' + message)
})

rout.get('/subscriber', (req, res) => {
    subscriber.subscribe('user-notify')
    res.send('Subscriber One')
})

module.exports = rout
