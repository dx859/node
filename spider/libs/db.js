const mysql = require('mysql')


class DB {
  constructor(opts) {
    this.conn = null
    this.opts = opts
    if (opts != null) {
      this.conn = mysql.createConnection(opts)
    }
  }

  configure(opts) {
    this.opts = opts
    if (this.conn) this.end()
    this.conn = mysql.createConnection(opts)
  }

  query(sql, data) {
    return new Promise((resolve, reject) => {
      if (data == null) {
        this.conn.query(sql, function (err, results, fields) {
          if (err) 
            reject(err)
          else
            resolve(results)
        })
        
      } else {
        this.conn.query(sql, data, function (err, results, fields) {
          if (err) 
            reject(err)
          else
            resolve(results)
        })
      }
    })
  }

  end() {
    this.conn.end()
  }
}

module.exports = (opts) => new DB(opts)