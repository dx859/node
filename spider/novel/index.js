const fs = require('fs')
const path = require('path')
const urllibs = require('url')
const request = require('request')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const { rp } = require('../libs/rp')

const db = require('../libs/db')({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'novel_test'
})

async function insertWebsite(websiteName, host, origin) {
    try {
        let sql = `INSERT INTO websites(name, host, origin) VALUES (?,?,?)`
        let { insertId } = await db.query(sql, [websiteName, host, origin])
        return insertId
    } catch (e) {
        let sql = `SELECT id FROM websites WHERE host=?`
        let [{ id }] = await db.query(sql, [host])
        return id
    }
}

async function insertNovel(name, author, intro, cover_img) {
    try {
        let sql = `INSERT INTO novels(name, author, intro, cover_img) VALUES (?, ?, ?, ?)`
        let { insertId } = await db.query(sql, [name, author, intro, cover_img, intro])
        return insertId
    } catch (e) {
        let sql = `SELECT id FROM novels WHERE name=? AND author=?`
        let [{ id }] = await db.query(sql, [name, author])
        return id
    }
}

async function insertNovelWebsite(novelId, websiteId, url) {
    try {
        let sql = `INSERT INTO novels_websites(novels_id, websites_id, url) VALUES (?, ?, ?)`
        let { insertId } = await db.query(sql, [novelId, websiteId, url])
        return insertId
    } catch (e) {
        let sql = `SELECT id FROM novels_websites WHERE novels_id=? AND websites_id=?`
        let [{ id }] = await db.query(sql, [novelId, websiteId])
        return id
    }
}

async function getPageInfo(url) {
    let host = (new urllibs.URL(url)).origin
    let buffer = await rp({ url: url, encoding: null })
    let html = iconv.decode(buffer, 'gbk')
    let $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })

    let name = $('#info h1').text()
    let author = $('#info p').eq(0).text().replace(/^.*者：/, '')
    let intro = $('#intro p').text()
    let cover_img = urllibs.resolve(host, $('#fmimg img').attr('data-cfsrc'))

    let chapters = $('#list dd a').map((i, el) => {
        let href = urllibs.resolve(host, $(el).attr('href'))
        let title = $(el).text()
        return href
    }).get()

    return { name, author, intro, cover_img, chapters }
}

async function insertChapter(novelId, websiteId, chapter, chapterSort, content, url) {
    let wordCount = content.length
    let sql = `INSERT INTO chapters (novels_id, websites_id, chapter, chapter_sort, word_count, content, url) VALUES (?,?,?,?,?,?,?)`
    let { insertId } = await db.query(sql, [novelId, websiteId, chapter, chapterSort, wordCount, content, url])
    return insertId
}

async function getChapter(url) {
    let buffer = await rp({ url: url, encoding: null })
    let html = iconv.decode(buffer, 'gbk')

    let $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })
    let title = $('.bookname h1').text()
    let content = $('#content').html().replace(/<br\/>/g, '').replace(/&nbsp;/g, ' ')

    return { title, content }
}

async function checkUrl(url) {
    let sql = 'SELECT id FROM novels_websites WHERE url=?'
    let res = await db.query(sql, [url])
    return !!res.length
}

async function insertChapters(novelId, websiteId, url, chapters) {
    for (let i = 0; i < chapters.length; i++) {
        let url = chapters[i]
        console.log('start: ', url)
        let { title, content } = await getChapter(url)
        await insertChapter(novelId, websiteId, title, i, content, url)
        console.log('end: ', url)
    }
}

async function insertConcurrency(novelId, websiteId, url, chapters, max = 5) {
    let arr = []
    let escapeStr = db.conn.escape.bind(db.conn)
    for (let i = 0; i < chapters.length; i++) {


        for (let j = 0; j < max; j++) {
            arr.push(getChapter(chapters[i]))
        }
        let info = await Promise.all(arr)
        if (i % max === 0 && i !== 0) {
            let sql = 'INSERT INTO chapters (novels_id, websites_id, chapter, chapter_sort, word_count, content, url) VALUES '
            for (let j = 0; j < info.length; j++) {
                let item = info[j]
                sql += `(${novelId}, ${websiteId}, ${escapeStr(item.title)}, ${i*max+j}, ${item.content.length}, ${escapeStr(item.title)}, ${escapeStr(url)})`
                if (j !== info.length - 1) {
                    sql += ','
                }
            }
            await db.query(sql)
        }
    }
}

async function __main() {
    let url = 'http://www.biquzi.com/0_703/'
    url = 'http://www.biquzi.com/0_700/'
    let websiteName = '笔趣阁'

    // let hasUrl = await checkUrl(url)
    // if (hasUrl) {
    //     console.log(`${url}: 已被爬取`)
    //     return
    // } 
    let startTime = Date.now()
    let urlObj = new urllibs.URL(url)
    let host = urlObj.host
    let origin = urlObj.origin

    let { name, author, intro, cover_img, chapters } = await getPageInfo(url)

    let websiteId = await insertWebsite(websiteName, host, origin)
    let novelId = await insertNovel(name, author, intro, cover_img)
    let novelWebsiteId = await insertNovelWebsite(novelId, websiteId, url)

    // await insertChapters(chapters)

    let info = await insertConcurrency(novelId, websiteId, url, chapters)

    console.log(Date.now() - startTime)
}



__main()