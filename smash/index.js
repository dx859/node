var a = {};


// arr.forEach(callback[, thisArg]);
[12, 3, 4].forEach(function(v, i, a) { // value, index, array

    console.log(v, i, a, this);

},a);


// arr.filter(callback[, thisArg]);
var arr1 = [12,323,4,1,4,143,112,3];
var arr2 = arr1.filter(function(value) {
    return value>10;
});
console.log(arr1);
console.log(arr2);

function isHello() {
    console.log(this.hello == 'world');
}

var b = isHello.bind({ hello: 'world' });
b();

var aa = function woot() {
    throw new Error();
};

console.log(aa.name);
