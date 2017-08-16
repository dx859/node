const fs = require('fs')
const path = require('path')
const urllibs = require('url')
const request = require('request')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const asyncLibs = require('async')

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') })
const { rp } = require('../libs/rp')
const log = console.log.bind(console)

const db = require('../libs/db')

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

    let catalog = $('#list dd a').map((index, el) => {
        let href = urllibs.resolve(host, $(el).attr('href'))
        let title = $(el).text()
        return { title, href, index }
    }).get()

    return { name, author, intro, cover_img, catalog }
}

async function insertChapter(novelId, websiteId, chapter, chapterSort, content, url) {
    let wordCount = content.length
    let sql = `INSERT INTO chapters (novels_id, websites_id, title, chapter_index, word_count, content, origin_url, is_spider) VALUES (?,?,?,?,?,?,?,1)`
    let { insertId } = await db.query(sql, [novelId, websiteId, chapter, chapterSort, wordCount, content, url])
    return insertId
}

async function getChapter(url, title, index) {
    let buffer = await rp({ url: url, encoding: null })
    let html = iconv.decode(buffer, 'gbk')

    let $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })
    title = title ? title : $('.bookname h1').text()
    let content = $('#content').html().replace(/(^\s*)|(\s*$)/g, '').replace(/<br\/>/g, '').replace(/&nbsp;/g, ' ')
    console.log(`GET => ${title} ${url}`)
    return { title, content, url, index }
}

async function checkUrl(url) {
    let sql = 'SELECT id FROM novels_websites WHERE url=?'
    let res = await db.query(sql, [url])
    return !!res.length
}

async function insertChapters(novelId, websiteId, chapters) {
    for (let i = 0; i < chapters.length; i++) {
        let url = chapters[i].href
        console.log('start: ', url)
        let { title, content } = await getChapter(url, chapters[i].title, i)
        await insertChapter(novelId, websiteId, title, i, content, url)
        console.log('end: ', url)
    }
    return chapters.length
}

async function getConcurrency(novelId, websiteId, chapters, maxLen = 10) {
    let arr = [],
        fns = [],
        res = []
    for (let i = 0; i < chapters.length; i += maxLen) {
        arr.push(chapters.slice(i, i + maxLen))
    }

    for (let i = 0; i < arr.length; i++) {
        let items = await Promise.all(arr[i].map(item => getChapter(item.href, item.title, item.index)))
        let affectedRows = await insertConcurrency(novelId, websiteId, items)
        // res = res.concat(items)
    }

    console.log('GET end...')
    // return res
}

/**
 * 并发插入数据库
 * @param  {Number}  小说id
 * @param  {Number}  网站id
 * @param  {Array}   章节内容
 * @return {Number}  受影响的行数
 */
async function insertConcurrency(novelId, websiteId, chapters) {
    let startTime = Date.now()
    let escapeStr = db.conn.escape.bind(db.conn)
    let sql = 'INSERT INTO chapters (novels_id, websites_id, title, chapter_index, word_count, content, origin_url, is_spider) VALUES'
    for (let i = 0; i < chapters.length; i++) {
        let item = chapters[i]
        sql += `(${escapeStr(novelId)}, ${escapeStr(websiteId)}, ${escapeStr(item.title)}, ${item.index} , ${escapeStr(item.content.length)}, ${escapeStr(item.content)}, ${escapeStr(item.originUrl)}, 1)`
        if (i !== chapters.length - 1) {
            sql += ','
        }
    }
    let { affectedRows } = await db.query(sql)
    console.log('insert sql: ', Date.now() - startTime, 'ms')
    return affectedRows
}

/**
 * 异步并发获取插入批量数据
 * @param  {[type]}
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function asyncInsert(novelId, websiteId, chapters, limit = 10) {
    let errChapters = []
    return new Promise((resolve, reject) => {

        asyncLibs.eachOfLimit(chapters, limit, function(chapter, index, cb) {
            request({ url: chapter.href, encoding: null, timeout: 2000 }, (err, response, body) => {
                if (err) {
                    errChapters.push(chapter)
                    cb(null)
                } else {
                    let sql = `INSERT INTO chapters (novels_id, websites_id, title, chapter_index, word_count, content, origin_url, is_spider) VALUES (?,?,?,?,?,?,?, 1)`
                    let { content } = parseChapter(body)
                    log(`GET => ${chapter.title} ${chapter.href}`)
                    db.query(sql, [novelId, websiteId, chapter.title, index, content.length, content, chapter.href])
                        .then(resultes => {
                            log(`insert: ${chapter.title} ${resultes.insertId}`)
                            cb(null)
                        })
                        .catch(err => {
                            errChapters.push(chapter)
                            cb(null)
                        })

                }
            })

        }, function(err) {
            log('end insert')
            resolve(errChapters)
        })
    })
}

/**
 * 异步并发获取章节
 * @param  {int}    小说id
 * @param  {int}    网站id
 * @param  {Array}  小说目录 {title, href}格式
 * @param  {Number} 限制并发数
 * @return {promise} errChapters：失败对象数组 sucChapters：成功对象数组
 */
function asyncGetChapters(catalog, limit = 10) {
    return new Promise((resolve, reject) => {
        asyncLibs.mapLimit(catalog, limit,
            function(chapter, cb) {
                let content = ''
                let title = chapter.title
                let originUrl = chapter.href
                let index = chapter.index
                rp({ url: originUrl, encoding: null, timeout: 2000 })
                    .then(res => {
                        let { content } = parseChapter(res)
                        log(`GET => ${title} ${originUrl}`)
                        cb(null, { title, content, originUrl, index })
                    })
                    .catch(err => {
                        cb(null, { title, content, originUrl, index })
                    })
            },
            function(err, res) {
                log('GET END...')
                resolve(res)
            })
    })
}



/**
 * 解析章节html
 * @param  {[type]}
 * @param  {[type]}
 * @return {[type]}
 */
function parseChapter(body, title) {
    let html = iconv.decode(body, 'gbk')

    let $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })
    title = title ? title : $('.bookname h1').text()
    let content = $('#content').html().replace(/<br\/>/g, '').replace(/&nbsp;/g, ' ')
    return { title, content }
}

async function __main() {
    let url = 'http://www.biquzi.com/0_703/'
    url = 'http://www.biquzi.com/0_700/'
    let websiteName = '笔趣阁'

    let hasUrl = await checkUrl(url)
    // if (hasUrl) {
    //     console.log(`${url}: 已被爬取`)
    //     return db.end()
    // } 
    let startTime = Date.now()
    let urlObj = new urllibs.URL(url)
    let host = urlObj.host
    let origin = urlObj.origin

    let { name, author, intro, cover_img, catalog } = await getPageInfo(url)

    let websiteId = await insertWebsite(websiteName, host, origin)
    let novelId = await insertNovel(name, author, intro, cover_img)
    let novelWebsiteId = await insertNovelWebsite(novelId, websiteId, url)


    let chapters = await asyncGetChapters(catalog)
    let affectedRows = await insertConcurrency(novelId, websiteId, chapters)
    log('insert rows: ', affectedRows)

    // let unlinks = await asyncInsert(novelId, websiteId, catalog)

    console.log('end: ', Date.now() - startTime, 'ms')
    db.end()
}



__main()