const { Router } = require('express')
const DB = require('../config.js')

const bcrypt = require('bcrypt')
const saltRounds = 10

const { check, validationResult } = require('express-validator')

const router = Router()

router.get('/', async (req, res) => {
    const results = await DB.promise().query(`select * from users`)
    console.log(results)
    res.sendStatus(200)
})

router.post(
    '/register',
    check('username')
        .isEmail()
        .notEmpty()
        .withMessage('Username cannot be empty')
        .isLength({ min: 4 })
        .withMessage('username should be at least 4 characters'),
    check('password').notEmpty().withMessage('password cannot be empty'),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { username, password } = req.body
        console.log(req.body)

        if (username && password) {
            try {
                bcrypt.hash(password, saltRounds, function (err, hash) {
                    DB.promise().execute(
                        `INSERT INTO users(username, password) VALUES(?, ?)`,
                        [username, hash],
                        (err, res) => {
                            if (err) throw err
                        }
                    )
                })

                res.status(201).send({ msg: 'created user' })
            } catch (error) {}
        }
    }
)

router.post('/login', (req, res) => {
    console.log(req.sessionID)
    const { username, password } = req.body
    if (username && password) {
        if (req.session.authenticated) {
            res.json(req.session)
        } else {
            if (password === password) {
                req.session.authenticated = true
                req.session.user = {
                    username,
                    password,
                }
                res.json(req.session)
            } else {
                res.status(403).json({ msg: 'bad credentials' })
            }
        }
    } else {
        res.status(403).json({ msg: 'bad credentials' })
    }
})

module.exports = router
