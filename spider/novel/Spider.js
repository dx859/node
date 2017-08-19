const request = require('request')
const iconv = require('iconv-lite')
const asyncLibs = require('async')

class Spider {
    constructor(character = 'utf8') {
        this.urlCols = new Map()
        this.collections = new Map()
        this.character = character
    }

    async spiderUrls(limit = 1) {
        await this.crawReady()
        while (this.urlCols.size) {
            await this.asyncGetPages(limit)
        }

        await this.crawComplete()
    }

    async crawReady() {}
    async crawComplete() {}

    afterGetPage(item, cb) {
        cb(null)
    }

    afterGetPageError(err, cb) {
        cb(null)
    }

    parsePage(html) {
        return html
    }

    asyncGetPages(limit = 1) {
        return new Promise((resolve, reject) => {
            asyncLibs.eachLimit(Array.from(this.urlCols.keys()), limit, (url, cb) => {
                this.asyncGetPage(url, this.character)
                    .then(html => {
                        let item = this.parsePage(html)
                        this.collections.set(url, item)
                        item.urlCol = this.urlCols.get(url)
                        this.urlCols.delete(url)
                        this.afterGetPage(item, url, cb)
                    })
                    .catch(e => {
                        this.afterGetPageError(e, cb)
                        
                    })
            }, (err) => {
                resolve()
            })
        })
    }

    asyncGetPage(url, character = 'utf8') {
        return new Promise((resolve, reject) => {
            request({ url: url, encoding: null, timeout: 2000 }, (err, res, body) => {
                if (err) return reject(err)
                if (res.statusCode === 200) {
                    let html = iconv.decode(body, character)
                    resolve(html)
                } else {
                    reject(`获取页面：${url}失败`)
                }
            })
        })
    }

}

module.exports = Spider