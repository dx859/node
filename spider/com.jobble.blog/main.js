/**
 * Created by daixi on 2017/9/10.
 */
const JobbleSpider = require('./JobbleSpider');

function main() {
    let jobble = new JobbleSpider();
    jobble.start();
}

main();