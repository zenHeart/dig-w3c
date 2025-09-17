const { expect } = require('chai');

describe('Error', function() {
    describe('Error.captureStackTrace', function() {
        it('change stack', function() {
          let a= (enable = true) => {
            let e = b()
            // 该操作会修改原始调用栈，从当前节点创建调用栈
            if(enable && Error.captureStackTrace) {
              Error.captureStackTrace(e)
            }
            return e
          }
          let b = () => {
            const c = 1;
            return new Error('test')
          }
          expect(a().stack).to.not.match(/at b/);
          expect(a(false).stack).to.match(/at b/);
        });
    });
});
