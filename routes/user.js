const { Router } = require('express')
const DB = require('../config.js')

const bcrypt = require('bcrypt')
const saltRounds = 10

const { check, validationResult } = require('express-validator')

const router = Router()

router.get('/', async (req, res) => {
    if (req.user) {
        const results = await DB.promise().query(`select * from users`)
        res.sendStatus(200).send(results[0])
    } else {
        res.status(403).send({ msg: 'not authenticated' })
    }
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
                const saltRounded = bcrypt.genSaltSync(saltRounds)
                bcrypt.hash(password, saltRounded, function (err, hash) {
                    DB.promise().execute(
                        `INSERT INTO users(username, password, salt) VALUES(?, ?, ?)`,
                        [username, hash, saltRounded],
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

module.exports = router
