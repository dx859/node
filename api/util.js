// util.inherits(constructor, superConstructor); 继承

var util = require('util');

function Base() {
    this.name = 'base';
    this.base = 1989;

    this.sayHello = function() {
        console.log('Hello ' + this.name);
    };
}

Base.prototype.showName = function() {
    console.log(this.name);
};

function Sub() {
    this.name = 'sub';
}

util.inherits(Sub, Base);

var objBase = new Base();
objBase.showName();
objBase.sayHello();
console.log(objBase);

var objSub = new Sub();
objSub.showName();
console.log(objSub);

console.log('--------------');

// util.inspect(object,[showHidden],[depth],[colors]) : 是一个将任意对象转换为字符串的方法

function Person() {
    this.name = 'jerry';

    this.toString = function () {
        return this.name;
    };
}

var obj = new Person();
console.log(obj);
console.log(util.inspect(obj));
console.log(util.inspect(obj, true));

// util.isArray(), util.isRegExp(), util.isDate(), util.isError() ... , util.debug()

// util.format(format[, ...]) : 类似C语言的 printf
console.log(util.format('%s %s', 'hello', 'world'));