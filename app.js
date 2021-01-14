const express = require('express')
const session = require('express-session')
const passport = require('passport')
const usersRoute = require('./routes/user')
const authRoute = require('./routes/auth')
const local = require('./strategies/local')
const store = new session.MemoryStore()
const app = express()

app.use(
    session({
        secret: 'key',
        cookie: { maxAge: 60000 },
        resave: true,
        saveUninitialized: true,
        store: store,
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
