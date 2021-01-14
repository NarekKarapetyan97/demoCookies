const localStrategy = require('passport-local')
const passport = require('passport')
const DB = require('../config.js')
const bcrypt = require('bcrypt')
const { use } = require('../routes/user.js')
const saltRounds = 10

passport.serializeUser((user, done) => {
    done(null, user.username)
})

passport.deserializeUser((username, done) => {
    try {
        const result = DB.promise().execute(
            `SELECT * FROM users WHERE username = ?`,
            [username],
            (err, res) => {
                console.log(err)
                if (err) throw err
            }
        )

        if (result) {
            return done(null, result)
        }
    } catch (error) {
        done(error, null)
    }
})

passport.use(
    new localStrategy(async (username, password, done) => {
        try {
            const result = await DB.promise().execute(
                `SELECT * FROM users WHERE username = ?`,
                [username],
                (err, res) => {
                    if (err) throw err
                }
            )

            if (!(result[0] && result[0][0])) {
                done(null, false)
            } else {
                bcrypt.hash(password, result[0][0].salt, function (err, hash) {
                    if (result[0][0].password === hash) {
                        return done(null, result[0][0])
                    } else console.log('password error')
                })
            }
        } catch (err) {
            done(err, false)
        }
    })
)
