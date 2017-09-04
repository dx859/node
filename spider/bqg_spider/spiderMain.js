const asyncLibs = require('async')
const HtmlDownloader = require('./HtmlDownloader')
const HtmlOutput = require('./HtmlOutput')
const HtmlParser = require('./HtmlParser')
const UrlManager = require('./UrlManager')
const log = console.log.bind(console)
db = require('../libs/db')


class SpiderMain {
  constructor() {
    this.htmlDownloader = new HtmlDownloader
    this.htmlOutput = new HtmlOutput('笔趣阁', 'http://www.biquzi.com')
    this.htmlParser = new HtmlParser
    this.urlManager = new UrlManager
  }

  async _craw(accessUrl) {
    await this.htmlOutput.init()
    this.urlManager.addNewUrl(accessUrl)

    let i = 0
    while (this.urlManager.hasNewUrl()) {
      let startTime = Date.now()

      let url = this.urlManager.getNewUrl()
      let html = await this.htmlDownloader.download(url, 'gbk')

      let getUrlTime = Date.now()

      let { newData, newUrls } = this.htmlParser.parserHtml(url, html)
      await this.htmlOutput.pCollectData(url, newData)
      this.urlManager.deleteUrl(url)
      this.urlManager.addNewUrls(newUrls)

      let endTime = Date.now()
      log(`craw=>${url} : ${getUrlTime-startTime}ms | InsertDB : ${endTime-getUrlTime}ms | ALL : ${endTime-startTime}ms`)

      i++
      if (i >= 100) break
    }

    db.end()
  }

  async craw(accessUrl) {
    await this.htmlOutput.init()
    this.urlManager.addNewUrl(accessUrl)

    let i = 0
    while (this.urlManager.hasNewUrl()) {
      let startTime = Date.now()

      let urls = this.urlManager.getNewUrls(100)

      await this.crawPages(urls)

      i++
      if (i >= 100) break
    }

    db.end()
  }

  async crawPages(urls, limit = 5) {
    return new Promise((resolve, reject) => {
      asyncLibs.eachLimit(urls, limit, (url, cb) => {
        let startTime = Date.now()
        this.htmlDownloader.download(url, 'gbk')
          .then(html => {
            let { newData, newUrls } = this.htmlParser.parserHtml(url, html)
            this.htmlOutput.pCollectData(url, newData)
              .then(res => {
                this.urlManager.deleteUrl(url)
                this.urlManager.addNewUrls(newUrls)
                log(`craw=>${url} | ${Date.now() - startTime}ms`)
                cb(null)
              })
              .catch(e => {
                log(e)
                cb(null)
              })
          })
          .catch(e => {
            log(e)
            cb(null)
          })
      }, err => resolve())
    })
  }

}

async function __main() {
  let spiderMain = new SpiderMain
  await spiderMain.craw('http://www.biquzi.com/5_5008/')
}

module.parent === null && __main()
module.exports = { HtmlDownloader, HtmlOutput, HtmlParser, UrlManager, SpiderMain }