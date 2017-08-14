require('dotenv').config({path: '../../.env'})
const http = require('http')
const request = require('request')
const { rp } = require('../libs/rp')
const Iconv  = require('iconv').Iconv
const fs = require('fs')
var iconv = require('iconv-lite');

const db = require('../libs/db')({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'novel'
})


const url = 'http://www.biquzi.com/0_703/'


request({
  url: url,
  encoding: null
}, function(err, response, body) {
  let html = iconv.decode(body,  'gbk')
  console.log(html)
})


// __main()