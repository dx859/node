const Observer = require('./observer');

class SecondObserver extends Observer {
    update() {
        console.log('second observer');
    }
}

module.exports = SecondObserver;
