const Target = require('./target');
const Adaptee = require('./adaptee');

class Adapter extends Target {
    request() {
        var adapteeObj = new Adaptee();
        adapteeObj.specialRequest();
    }
}

module.exports = Adapter;
