const fs = require('fs')
const path = require('path')
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

  async craw(accessUrl) {
    await this.htmlOutput.init()

    if (this.urlManager.newUrls.size === 0) {
      if (accessUrl) 
        accessUrl = [accessUrl]
      else      
        accessUrl = await this.htmlOutput.getAccessUrls()

      this.urlManager.addNewUrls(accessUrl)
    }

    let i = 0
    while (this.urlManager.hasNewUrl()) {
      let startTime = Date.now()
      let url = this.urlManager.getNewUrl()
      try {
        let html = await this.htmlDownloader.download(url, 'gbk')
        let getUrlTime = Date.now()
        let { newData, newUrls } = this.htmlParser.parserHtml(url, html)
        await this.htmlOutput.collectData(url, newData)
        this.urlManager.deleteUrl(url)
        this.urlManager.addNewUrls(newUrls)

        let endTime = Date.now()
        let logstr = `craw=>${url} ${getUrlTime-startTime}ms| insert=>${newData.name} ${endTime-getUrlTime}ms`
        log(logstr)
        fs.appendFileSync(path.join(__dirname, 'craw.log'), logstr+'\n')
        
      } catch(e) {
        log(`ERROR=>${url}`)
        fs.appendFileSync(path.join(__dirname, 'error.log'), String(e) + '\n')
        this.urlManager.addErrUrl(url)
      }
      log(`men=>${Number(process.memoryUsage().rss/(1024*1024)).toFixed(2)}M | ${this.urlManager.newUrls.size} ${this.urlManager.oldUrls.size}`)
    
      i++
      if (i >= 1000) break
    }

    db.end()
    this.urlManager.saveUrl()

  }

}

async function __main() {
  let url = 'http://www.biquzi.com/4_4965/'
  let spiderMain = new SpiderMain
  await spiderMain.craw()
}

module.parent === null && __main()
module.exports = { HtmlDownloader, HtmlOutput, HtmlParser, UrlManager, SpiderMain }
