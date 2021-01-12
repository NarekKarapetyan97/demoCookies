const { Router } = require('express')
const DB = require('../config.js')

const { check, validationResult } = require('express-validator')

const router = Router()

router.get('/', async (req, res) => {
    const results = await DB.promise().query(`select * from users`)
    console.log(results)
    res.send(200)
})

router.post(
    '/',
    check('username').notEmpty().withMessage('Username cannot be empty'),
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
                const userData = { username, password }
                DB.promise().execute(
                    `INSERT INTO users(username, password) VALUES(?, ?)`,
                    [username, password],
                    (err, res) => {
                        if (err) throw err
                    }
                )
                res.status(201).send({ msg: 'created user' })
            } catch (error) {
                console.log(err)
            }
        }
    }
)

module.exports = router
