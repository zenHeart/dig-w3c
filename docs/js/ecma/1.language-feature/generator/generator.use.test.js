require('babel-polyfill');
const { expect, should, assert } = require('chai');
const utils = require('./utils');

describe('异步任务运行器 taskRunner', function () {
  it('利用生成器创建任务运行器', function() {
     let asyncTask1 = () => {
       let a= Promise.resolve(3);
       return (err,cb) => {
         a.then(cb)
       } 
     }
     let task2 = console.log
     let tasks = function*() {
       let res = yield asyncTask1();
       yield task2;
     }
  })
  
});
describe('无限状态机 fib', function() {
  it('fib 无限惰性求值',function() {
    let fib = utils.fib();
    let expectData = [1,1,2,3,5,8,13,21,34,55]
    expectData.forEach(el => {
      expect(fib.next().value).eq(el);
    })
    
  })
})
