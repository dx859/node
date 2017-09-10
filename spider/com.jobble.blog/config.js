/**
 * Created by daixi on 2017/9/10.
 */
const path = require('path');

module.exports = {
    imagedir: path.join(__dirname, 'imgs'),
    db: {
        host: '127.0.0.1',
        port: '3306',
        user: 'root',
        password: '',
        database: 'spider_info',
    },
}