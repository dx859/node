require('dotenv').config()

// const connection = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   database: 'novel'
// })


// let sql = 'SELECT * FROM `novels_test`'
// connection.query(sql, (error, results) => {
//   if (error) throw error

//   console.log( results)
// })

// connection.end()

const db = require('../libs/db')({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'novel'
})


async function __main() {
  
  const sql = 'SELECT * FROM `novels_test`'

  let res = await db.query(sql)

  console.log(res)
}

__main()