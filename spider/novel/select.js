const path = require('path')
const mysql = require('mysql')
require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const { rp } = require('../libs/rp')

const db = require('../libs/db')

// let opts = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: 'novel_test'
// }
// db.configure(opts)
// console.log(opts)

async function __main() {
    // 获取总字数

    let name = '在家道士'
    let sql = `SELECT SUM(chapters.word_count) count FROM novels 
        LEFT JOIN chapters ON novels.id = chapters.novels_id
        WHERE novels.name=?`
    let res= await db.query('SHOW TABLES')
    console.log(res)

}

__main()