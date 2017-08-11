const https = require('https')
const fs = require('fs')
const cheerio = require('cheerio')
const { rp } = require('../libs/rp')

const URL = 'https://github.com/'
const LoginURL = 'https://github.com/login'
const SessionURL = 'https://github.com/session'

let arguments = process.argv.slice(2)

async function __main() {
  let html = await rp(LoginURL)
  let $ = cheerio.load(html)
  const token = $('input[name=authenticity_token]').val()
  const postData = {
    commit: 'Sign in',
    utf8: '✓',
    authenticity_token: token,
    login: arguments[0],
    password: arguments[1],
  }
  await rp({ uri: SessionURL, method: 'POST', form: postData })

  html = await rp(URL)

  let startTime = Date.now()
  $ = cheerio.load(html)
  let arr = $('li.public span.repo').map((i, el) => $(el).text()).get()

  console.log(arr)
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