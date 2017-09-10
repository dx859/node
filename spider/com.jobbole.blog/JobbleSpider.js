/**
 * Created by daixi on 2017/9/10.
 */
const urlLib = require('url');
const request = require('request');
const {log} = require('../utils/common');
const Response = require('./response');
const ImagePipeline = require('./pipeline/ImagePileline');

class JobbleSpider {
    constructor() {
        this.start_urls = ['http://blog.jobbole.com/all-posts/'];
        this.running = 0;
        this.limit = 5;
        this.parse = this.parse.bind(this);
        this.parseDetail = this.parseDetail.bind(this);

        this.urls = new Map(this.start_urls.map(url => [url, {fn: this.parse}]));
        this.failedUrls = new Set();
        this.imagePipeline = new ImagePipeline();
        this.pipelines = [];
        this.pipelines.push(this.imagePipeline);

    }

    start() {
        while (this.running < this.limit && this.urls.size > 0) {
            let url = this.urls.keys().next().value;
            let item = this.urls.get(url);
            this.urls.delete(url);
            let startTime = Date.now();
            request({uri: url, timeout: 10000}, (err, response, body) => {
                let endTime = Date.now();
                log.log(`GET=>${url}: ${endTime-startTime}ms`)
                this.running--;
                if (err) {
                    log.error(`${url}=>${err}`);
                    return this.failedUrls.add(url);
                }
                if (response.statusCode !== 200) {
                    log.error(`${url}=>statusCode=${response.statusCode}`);
                    return this.failedUrls.add(url);
                }
                let res = new Response(body, url);
                res.meta = item.meta;
                item.fn(res);
                if (this.urls.size > 0)
                    this.start();
            });
            this.running++;
        }

    }

    async startPipeline(item) {
        for (let i=0; i<this.pipelines.length; i++) {
            item = await this.pipelines[i].process_item(item);
        }
    }

    parse(response) {
        let nodes = response.cheerio('#archive .post-thumb a');
        nodes.each( (i, el) => {
            let baseUrl = response.url;
            let postUrl = response.cheerio(el).attr('href');
            let imgUrl = response.cheerio(el).find('img').attr('src');
            postUrl = urlLib.resolve(baseUrl, postUrl);
            imgUrl = urlLib.resolve(baseUrl, imgUrl);
            this.urls.set(postUrl, {fn: this.parseDetail, meta: {imgUrl}})
        });

    }

    parseDetail(response) {
        let title = response.cheerio('.entry-header h1').text();
        let front_url_path = response.meta.imgUrl;
        // log.log(title)
        this.startPipeline({title, front_url_path});
    }


}

module.exports = JobbleSpider;

if (module.parent === null) {
    let jobble = new JobbleSpider();
    jobble.start();
}