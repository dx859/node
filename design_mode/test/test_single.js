var Single = require('../single/single_class');
var Single_es6 = require('../single/single_class_es6');

var singleObj1 = new Single('001');
var singleClass1 = singleObj1.getInstance();
singleClass1.show(); // danli 001

var singleObj2 = new Single('002');
var singleClass2 = singleObj2.getInstance();
singleClass2.show(); // danli 001


var singleClass3 = Single_es6('1');
singleClass3.show(); // danli 001


var singleClass4 = Single_es6('1');
singleClass4.show(); // danli 001
