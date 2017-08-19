const urllibs = require('url')
const path = require('path')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')
const asyncLibs = require('async')
const request = require('request')
const mysql = require('mysql')



const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'novel_test'
})

const log = console.log.bind(console)

class SpiderNovel {
    /**
     * @param  {String}  小说目录的url
     */
    constructor(url, websiteName = '笔趣阁', character = 'utf8') {
        this.url = url
        this.origin = (new urllibs.URL(url)).origin
        this.host = (new urllibs.URL(url)).host
        this.character = character
        this.websiteName = websiteName

    }

    /**
     * 获取页面html
     * @param  {String}  源网站字符编码
     * @return {String}
     */

    getPage(url, character) {
        url = url ? url : this.url
        character = character ? character : this.character
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

    /**
     * 批量插入章节
     * @param  {Number}  小说id
     * @param  {Number}  网站id
     * @param  {Array}   章节内容：{title, originUrl, index}
     * @param  {Number}  并发插入量
     * @return {Promise} 返回带id的 chapters
     */
    asyncInsertChapters(novelId, websiteId, chapters, limit = 10) {
        return new Promise((resolve, reject) => {
            asyncLibs.mapLimit(chapters, limit,
                (chapter, cb) => {
                    this.insertChapter(novelId, websiteId, chapter)
                        .then(res => {
                            log(`INSERT chapters => ${chapter.title}`)
                            chapter.id = res.insertId
                            cb(null, chapter)
                        })
                        .catch(err => {
                            cb(null, chapter)
                        })
                }, (err, res) => {
                    resolve(res)
                })
        })
    }

    /**
     * 批量获取、插入章节内容
     * @param  {Array}  {title, originUrl, index, id}
     * @param  {Number}  并发插入量
     * @return {Object}
     */
    asyncInsertContents(chapters, limit = 10) {
        return new Promise((resolve, reject) => {
            asyncLibs.mapLimit(chapters, limit,
                (chapter, cb) => {
                    this.getPage(chapter.originUrl)
                        .then(res => {
                            log(`GET => ${chapter.originUrl}`)
                            let { content } = this.parseContentPage(res)
                            return this.insertContent(chapter.id, content)
                        })
                        .then(res => {
                            log(`INSERT => ${chapter.title}`)
                            chapter.content_id = res.insertId
                            cb(null, chapter)
                        })
                        .catch(err => {
                            cb(null, chapter)
                        })
                }, (err, res) => {
                    resolve(res)
                })
        })
    }

    /**
     * 插入章节表
     * @param  {Number}  小说id
     * @param  {Number}  网站id
     * @param  {Array}   章节内容：{title, originUrl, index}
     * @return {Object}  
     */
    insertChapter(novelId, websiteId, chapter) {
        return new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) return jre
            })
            let sql = `INSERT INTO chapters (novels_id, websites_id, title, chapter_index, origin_url) VALUES (?,?,?,?,?)`
            db.query(sql, [novelId, websiteId, chapter.title, chapter.index, chapter.originUrl], (err, res) => {
                if (err)
                    reject(err)
                else
                    resolve(res)
            })
        })
    }

    /**
     * 插入章节内容表(事务处理)
     * @param  {Number}  章节id
     * @param  {Number}  章节内容
     * @return {Object}  
     */
    insertContent(chapters_id, content) {
        return new Promise((resolve, reject) => {
            db.beginTransaction(err => {
                if (err) return reject(err)
                let sql = `INSERT INTO contents (content, chapters_id) VALUES (?,?)`
                db.query(sql, [content, chapters_id], (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        db.query('UPDATE chapters SET is_spider=1 WHERE id=?', [chapters_id], (err, res) => {
                            if (err) {
                                return db.rollback(() => reject(err))
                            }
                            db.commit(err => {
                                if (err) {
                                    return db.rollback(()=> reject(err))
                                }
                                resolve(res)
                            })
                        })
                    }
                })

            })
        })
    }

    insertWebsites(websiteName, host, origin) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO websites(name, host, origin) VALUES (?,?,?)`
            db.query(sql, [websiteName, host, origin], (err, res) => {
                if (err) {
                    let sql = `SELECT id FROM websites WHERE host=?`
                    db.query(sql, [host], (err, res) => {
                        if (err)
                            reject(err)
                        else
                            resolve(res[0].id)
                    })
                } else {
                    resolve(res.insertId)
                }
            })
        })
    }

    insertNovels(name, author, intro, cover_img) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO novels(name, author, intro, cover_img) VALUES (?, ?, ?, ?)`
            db.query(sql, [name, author, intro, cover_img, intro], (err, res) => {
                if (err) {
                    let sql = `SELECT id FROM novels WHERE name=? AND author=?`
                    db.query(sql, [name, author], (err, res) => {
                        if (err)
                            reject(err)
                        else
                            resolve(res[0].id)
                    })
                } else {
                    resolve(res.insertId)
                }
            })
        })
    }

    insertNovelsWebsites(novelId, websiteId, url) {
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO novels_websites(novels_id, websites_id, url) VALUES (?, ?, ?)`
            db.query(sql, [novelId, websiteId, url], (err, res) => {
                if (err) {
                    let sql = `SELECT id FROM novels_websites WHERE novels_id=? AND websites_id=?`
                    db.query(sql, [novelId, websiteId], (err, res) => {
                        if (err)
                            reject(err)
                        else
                            resolve(res[0].id)
                    })
                } else {
                    resolve(res.insertId)
                }
            })
        })
    }


    /**
     * 解析小说目录页面内容
     * @param  {String}  页面html
     * @return {Obj}  {name, author, intro, cover_img, chapters:{title, originUrl, index}}
     */
    parseChapterPage(html, origin) {
        origin = origin ? origin : this.origin
        let $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })
        let name = $('#info h1').text()
        let author = $('#info p').eq(0).text().replace(/^.*者：/, '')
        let intro = $('#intro p').text()
        let cover_img = urllibs.resolve(origin, $('#fmimg img').attr('data-cfsrc'))

        let chapters = $('#list dd a').map((index, el) => {
            let originUrl = urllibs.resolve(origin, $(el).attr('href'))
            let title = $(el).text()
            return { title, originUrl, index }
        }).get()

        return { name, author, intro, cover_img, chapters }
    }

    /**
     * 解析小说章节内容页面
     * @param  {String}  页面html
     * @param  {title}   文章标题
     * @return {Obj}    { title, content }
     */
    parseContentPage(html, title) {
        let $ = cheerio.load(html, { decodeEntities: false, xmlMode: true })
        let content = $('#content').html().replace(/(^\s*)|(\s*$)/g, '').replace(/<br\/>/g, '').replace(/&nbsp;/g, ' ')
        title = title ? title : $('.bookname h1').text()
        return { title, content }
    }

    async start() {
        let info = await this.getPage()
        log(`GET => ${this.url}`)
        let { name, author, intro, cover_img, chapters } = this.parseChapterPage(info)

        let websiteId = await this.insertWebsites(this.websiteName, this.host, this.origin)
        log(`INSERT websites`)
        let novelId = await this.insertNovels(name, author, intro, cover_img)
        log(`INSERT novels`)
        let novelWebsiteId = await this.insertNovelsWebsites(novelId, websiteId, this.url)
        log(`INSERT novels_websites`)

        chapters = await this.asyncInsertChapters(novelId, websiteId, chapters)
        log(`INSERT chapters`)
        chapters = await this.asyncInsertContents(chapters)
        db.end()
    }
}

module.exports = SpiderNovel

