// 异步：I/O, setTimeout(), setInterval(), setImmediate(), process.nextTick()

// 在未了解process.nextTick()时，为了立即执行一个任务，会这样调用：
// setTimeout(function () {
//   // TODO
// }, 0);
// 实际上使用process.nextTick()

// process.nextTick = function(callback) {
//   if (process._exiting) return;

//   if (tickDepth >= process.maxTickDepth)
//     maxTickWarn();

//   var tock = { callback: callback };
//   nextTickQueue.push(tock);
//   if (nextTickQueue.length) {
//     process._needTickCallback();
//   }
// }

setImmediate(function() {
  console.log('延迟执行, setImmediate');
});
process.nextTick(function() {
  console.log('延迟执行, nextTick');
});
console.log('正常执行');
