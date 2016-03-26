var EventEmitter = require('events').EventEmitter

var life = new EventEmitter()
life.setMaxListeners(10) // 设置监听最多事件数量

function showName(who) {
    console.log('you name is ' + who)
}

function doSome(who) {
    console.log(who + 'is do something')
}

// 可以同时监听多个函数
life.on('name', showName)
life.on('name', doSome)

// 删除事件监听函数
life.removeListener('name', showName)
// life.removeAllListeners() // 移除所有事件监听
// life.removeAllListeners('name') // 移除某一事件所有事件监听

// 查看事件监听数量
console.log(life.listeners('name').length)
console.log(EventEmitter.listenerCount(life, 'name'))

life.emit('name', 'daixi')
life.emit('name', 'zhangsan')

