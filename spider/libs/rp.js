let request = require('request')

let j = request.jar()
request = request.defaults({ jar: j })

exports.rp = function(arg) {
  return new Promise((resolve, reject) => {
    let url = (typeof arg === 'string') ? arg : arg.uri
    let method = (typeof arg === 'string') ? 'GET' : arg.method
    let startTime = Date.now()
    console.log(`--> ${method}: ${url}`)
    request(arg, (err, response, body) => {
      console.log(`<-- ${method}: ${url} ${Date.now() - startTime}ms`)
      if (err)
        reject(err)
      else
        resolve(body)
    })
  })
}
