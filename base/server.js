'use strict'
var http = require('http')

let url = 'http://www.baidu.com';

var html = '';
var req = http.request({
    hostname: 'www.baidu.com',
    port: 80,
    method: 'GET'
}, (res) => {
    var i = 0

    res.on('data',(data) =>{
        // console.log(`BODY:${data}`)
        i++
        html+=data
    })

    res.on('end', () => {
        console.log(html, i)
    })

}).on('error', function() {
    console.log('获取课程数据出错')
})

req.end()