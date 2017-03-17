var ejs = require('ejs');

// 模版
var string = "好高兴，惊天我买了iphone<%= a %>";

// 数据
var data = {
    a : 6
};

// 数据绑定
var html = ejs.render(string, data);

console.log(html);