const {expect} = require ('chai');
const sinon = require ('sinon');

describe ('验证代理构造器', function () {
	it('验证空代理',function() {
		let obj = {a:{a:1}};
		let pObj = new Proxy(obj,{});

		expect(obj.a).to.equal(pObj.a);
	})
	it ('陷阱函数的基本使用', function () {
	/**
	 * 该示例说明了 proxy 的基本用法
	 * 1. 利用 new Proxy(target,options) 返回代理对象
	 * 2. 利用 get(target,key,receiver) 记录日志
	 * 3. 利用 set(target,key,value,receiver) 校验输入
	 */
    let spyLog = sinon.spy ();
    let obj = {};
    let proxyObj = new Proxy (obj, {
      get (target, key, receiver) {
        spyLog (
          `time:'${new Date ().toLocaleString ()}' key:${key} value:${target[key]}`
        );
        return target[key];
      },
      set (target, key, value, receiver) {
        if (typeof value !== 'number') {
          throw new TypeError ('set value must number');
        }
        return Reflect.set (target, key, value, receiver);
      }
    });
    proxyObj.a = 1;
	proxyObj.a;
	let setAStr = () => {
		proxyObj.a = 'a'
	};
	// 验证对 spyLog 的调用
	expect(spyLog.args[0][0]).to.match(/time:.*key:a value:1/)
	expect(setAStr).to.throw(/set value must number/);
  });
});
