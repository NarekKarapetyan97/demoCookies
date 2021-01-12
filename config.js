const mysql = require('mysql2')

module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'user',
    password: 'password',
    database: 'sample',
})
