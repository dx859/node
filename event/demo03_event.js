var events = require('events');

class MyObj extends events.EventEmitter {

}

var myObj = new MyObj();

myObj.once("someEvent", function() {
    console.log('====');
});

myObj.emit("someEvent");
