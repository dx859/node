/**
 * Created by daixi on 2017/9/10.
 */
const fs = require('fs');
const crypto = require('crypto');
const path = require('path')
const {Console} = require('console');


const output = fs.createWriteStream(path.join(path.dirname(module.parent.filename), 'log', 'stdout.log'));
const errOutput = fs.createWriteStream(path.join(path.dirname(module.parent.filename), 'log', 'stderr.log'));
let log;
if (process.env.NODE_ENV === 'production')
    log = new Console(output, errOutput);
else
    log = new Console(process.stdout, process.stderr);

exports.log = log;

exports.md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex');
}
