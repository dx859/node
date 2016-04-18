const EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

emitter.on('someEvent', function(arg1, arg2) {
    console.log(arg1, arg2);
});

emitter.once('someEvent', function(arg1, arg2) {
    console.log('hi');
});

emitter.emit('someEvent', 'hello', 'world');
emitter.emit('someEvent', 'hello', 'world');


// emitter.removeListener(event, listener)
// emitter.removeAllListeners([eventName])
