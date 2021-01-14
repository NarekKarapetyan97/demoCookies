const express = require('express')
const session = require('express-session')
const passport = require('passport')
const redis = require('redis')
const connectRedis = require('connect-redis')

const usersRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const local = require('./strategies/local')
const store = new session.MemoryStore()

const app = express()

const redisStore = connectRedis(session)

const redisClient = redis.createClient({
    port: 6379,
    host: 'localhost',
})

app.use(
    session({
        secret: 'key',
        cookie: { maxAge: 60000, httpOnly: true },
        resave: false,
        saveUninitialized: true,
        store: new redisStore({ client: redisClient }),
    })
)

app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

app.use('/user', usersRoute)
app.use('/auth', authRoute)

app.listen(3000, () => {
    console.log('server running')
})
