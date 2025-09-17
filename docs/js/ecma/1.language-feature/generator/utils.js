/**
 * 参考 understanding es6 使用迭代器创建任务运行器
 * @param {*} taskDef 输入为迭代器
 * 实现包含同步和异步的瀑布流执行器
 */
exports.taskRunner = function taskRunner(taskDef) {
  // 调用生成器返回迭代内容
  let tasks = taskDef();
  // 执行第一个任务接收返回结果
  let res = tasks.next();
  // step 函数处理迭代器的后续运行

  function step() {
    // 任务执行结束，返回 true
    if (!res.done) {
      if (typeof res.value === 'function') {
        res.value((err, data) => {
          if (err) {
            // 任务执行失败返回错误
            res = tasks.throw(err);
            // 任务失败直接返回
            return;
          }
          // 将返回结果作为下一个任务的输入
          res = tasks.next(data);
          step();
        });
      } else {
        res = tasks.next(data);
        step();
      }
    }
  }
  // 处理任务
  step();
};

/**
 * 采用迭代器处理无限状态机
 * 由于迭代器为惰性运算，可以只在需要的时候生成值
 * 对于需要保留状态的 io 密集工作有优势
 * fn = fn-1 + fn-2 1 1 2 3 5 8
 *  */
exports.fib = function* () {
  let a1 = 1;
  yield a1;
  let a2 = 1;
  yield a2;
  let next = a1 + a2;
  while (1) {
    yield next;
    a1 = a2;
    a2 = next;
    next = a1 + a2;
  }
};
