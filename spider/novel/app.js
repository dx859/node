const urllibs = require('url')
const path = require('path')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const asyncLibs = require('async')
const request = require('request')
const mysql = require('mysql')

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const { rp } = require('../libs/rp')

let SpiderNovel = require('./spiderNovel')

const log = console.log.bind(console)

async function main() {

    let url = 'http://www.biquzi.com/0_703/'
    url = 'http://www.biquzi.com/0_700/'
    let websiteName = '笔趣阁'


    let a = new SpiderNovel(url, websiteName, 'gbk')

    let startTime = Date.now()
    await a.start()
    log(`end: ${Date.now() - startTime}ms`)
}

// main()

'http://zhannei.baidu.com/cse/search?q=&p=1&s=11815863563564650233&entry=1'
'http://zhannei.baidu.com/cse/search?q=&p=2&s=11815863563564650233&entry=1'

async function getNovels() {
    const accessUrl = 'http://zhannei.baidu.com/cse/search?q=&p=0&s=11815863563564650233&entry=1'
    var arrUrl = []
    for (let i = 0; i < 10; i++) {
        arrUrl.push(`http://zhannei.baidu.com/cse/search?q=&p=${i}&s=11815863563564650233&entry=1`)
    }

    // let html = await getPage(accessUrl)
    // let info = parsePage(html)
    // arrUrl.length = 1
    let info = await asyncGetPages(arrUrl)
    log(info)
    log(info.length)
}

getNovels()

function getPage(url, character = 'utf8') {
    return new Promise((resolve, reject) => {
        request({ url: url, encoding: null, timeout: 2000 }, (err, res, body) => {
            if (err) return reject(err)
            if (res.statusCode === 200) {
                let html = iconv.decode(body, character)
                resolve(html)
            } else {
                reject(`获取页面：${this.url}失败`)
            }
        })
    })
}

function asyncGetPages(arr, limit = 10) {
    return new Promise((resolve, reject) => {
        asyncLibs.concatLimit(arr, limit, (url, cb) => {
            request(url, (error, response, body) => {
                let obj = parsePage(body)
                cb(null, obj)
            })

        }, (err, res) => {
            resolve(res)
        })
    })
}

function parsePage(html) {
    let $ = cheerio.load(html)
    let novels = []
    return $('.result-item').map((index, el) => {
        let cover_img = $(el).find('img').attr('src')
        let title = $(el).find('.result-game-item-title-link').attr('title')
        let author = $(el).find('.result-game-item-info-tag').eq(0).find('span').eq(1).text().replace(/(^\s*)|(\s*$)/g, '')
        let category = $(el).find('.result-game-item-info-tag').eq(1).find('span').eq(1).text()
        let updateAt = $(el).find('.result-game-item-info-tag').eq(2).find('span').eq(1).text()
        return { title, author, category, updateAt, cover_img }
    }).get()
}