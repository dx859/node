class UrlManager {
  constructor() {
    this.newUrls = new Set()
    this.oldUrls = new Set()
  }

  addNewUrl(url) {
    if (url === undefined)
      return
    if (!this.oldUrls.has(url))
      this.newUrls.add(url)
  }

  addNewUrls(urls) {
    urls.forEach((url) => { this.addNewUrl(url) })
  }

  getNewUrl() {
    return this.newUrls.values().next().value
  }

  getNewUrls(num) {
    let i = 0,
      urls = []
    for (let item of this.newUrls.values()) {
      urls.push(item)
      i++
      if (i === num) break
    }
    return urls
  }

  hasNewUrl() {
    return this.newUrls.size !== 0
  }

  deleteUrl(url) {
    this.newUrls.delete(url)
    this.oldUrls.add(url)
  }
}

module.exports = UrlManager