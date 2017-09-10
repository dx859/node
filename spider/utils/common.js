/**
 * Created by daixi on 2017/9/10.
 */
const fs = require('fs');
const {Console} = require('console');

const output = fs.createWriteStream('./log/stdout.log');
const errOutput = fs.createWriteStream('./log/stderr.log');
let log;
if (process.env.NODE_ENV === 'production')
    log = new Console(output, errOutput);
else
    log = new Console(process.stdout, process.stderr);

module.exports = log;