const urllibs = require('url')
const path = require('path')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const asyncLibs = require('async')
const request = require('request')
const mysql = require('mysql')
const fs = require('fs')

const NovelSpider = require('./NovelSpider')
const ChapterSpider = require('./ChapterSpider')
const TestChapterSpider = require('./TestChapterSpider')
const ContentSpider = require('./ContentSpider')

require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') })
const { rp } = require('../libs/rp')
const db = require('../libs/db')

const log = console.log.bind(console)

async function main() {

    const WebsiteOrigin = 'http://www.biquzi.com'
    const WebsiteId = 1

    // let novelspider = new NovelSpider(db, 1)
    // await novelspider.spiderUrls(5)

    // await new ChapterSpider(db, 1).spiderUrls(5)
    // for (let i = 0; i < 10; i++) {
    //     await new ContentSpider(db, 10).spiderUrls(20)
    // }

    await new TestChapterSpider(db, 1).spiderUrls(5)
    db.end()
}

main()