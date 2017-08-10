const https = require('https')
const fs = require('fs')
const querystring = require('querystring')
let request = require('request')
const cheerio = require('cheerio')
const Cookie = require('tough-cookie').Cookie;

const URL = 'https://github.com/'
const LoginURL = 'https://github.com/login'
const SessionURL = 'https://github.com/session'

let j = request.jar()
request = request.defaults({ jar: j })

let rp = function(arg) {
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


async function __main() {
  let html = await rp(LoginURL)
  let $ = cheerio.load(html)
  const token = $('input[name=authenticity_token]').val()
  const postData = {
    commit: 'Sign in',
    utf8: '✓',
    authenticity_token: token,
    login: 'daixi859@gmail.com',
    password: 'daixi85941049',
  }
  await rp({uri: SessionURL, method: 'POST', form: postData})
  html = await rp(URL)
  $ = cheerio.load(html)
  let arr = $('li.public span.repo').map((i, el) => $(el).text()).get()

}


__main()









// rp(LoginURL)
//   .then(res => {
//     let $ = cheerio.load(res)
//     const token = $('input[name=authenticity_token]').val()

//     const postData = {
//       commit: 'Sign in',
//       utf8: '✓',
//       authenticity_token: token,
//       login: 'daixi859@gmail.com',
//       password: 'daixi85941049',
//     }
//     return rp({
//       uri: SessionURL,
//       method: 'POST',
//       form: postData
//     })
//   }).then(res => {
//     console.log(res)
//   })