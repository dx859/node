const Observer = require('./observer');

class FirstObserver extends Observer {
    update() {
        console.log('first observer');
    }
}

module.exports = FirstObserver;
