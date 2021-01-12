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

// app.get('/', (req, res) => {
//     res.send({
//         msg: 'hiiii',
//     })
// })

// function validateCookie(req, res, next) {
//     const { cookies } = req
//     if ('session_id' in cookies) {
//         console.log('session id exists')
//         if (cookies.session_id === '1234567') {
//             next()
//         } else res.status(403).send({ msg: 'not outintaceted' })
//     } else res.status(403).send({ msg: 'not outintaceted' })
// }

// app.get('/signin', validateCookie, (req, res) => {
//     res.cookie('session_id', '123456')
//     res.status(200).json({ msg: 'loged in' })
// })

// app.post('/login', (req, res) => {
//     console.log(req.sessionID)
//     const { username, password } = req.body
//     if (username && password) {
//         if (req.session.authenticated) {
//             res.json(req.session)
//         } else {
//             if (password === '123') {
//                 req.session.authenticated = true
//                 req.session.user = {
//                     username,
//                     password,
//                 }
//                 res.json(req.session)
//             } else {
//                 res.status(403).json({ msg: 'bad credentials' })
//             }
//         }
//     } else {
//         res.status(403).json({ msg: 'bad credentials' })
//     }
// })
