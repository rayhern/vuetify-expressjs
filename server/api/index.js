const router = require('express').Router()
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
})

// Express API here
// Mock Users
const users = [
  { name: 'John' },
  { name: 'Alexander' },
  { name: 'Luke' }
]

/* GET users listing. */
router.get('/users', function (req, res, next) {
  res.json(users)
})

router.get('/mysqltest', function (req, res, next) {
  connection.query('SELECT phone FROM api_phonenumber ORDER BY RAND() LIMIT 10', function (error, results, fields) {
    if (error) { throw error }
    // connected!
    const objs = []
    for (let i = 0; i < results.length; i++) {
      objs.push({ phone: results[i].phone })
    }
    res.end(JSON.stringify(objs))
  })
})

/* GET user by ID. */
router.get('/users/:id', function (req, res, next) {
  const id = parseInt(req.params.id)
  if (id >= 0 && id < users.length) {
    res.json(users[id])
  } else {
    res.sendStatus(404)
  }
})

module.exports = router
