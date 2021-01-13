const express = require('express')
const session = require('express-session')
const usersRout = require('./routes/user')
const store = new session.MemoryStore()
const app = express()

app.use(
    session({
        secret: 'key',
        maxAge: 60000,
        resave: true,
        saveUninitialized: true,
        store: store,
    })
)

app.use(express.json())

app.use('/user', usersRout)

app.listen(3000, () => {
    console.log('server running')
})
