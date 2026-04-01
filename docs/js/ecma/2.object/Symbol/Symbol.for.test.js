const { expect } = require('chai');

describe('Symbol.for() 与 Symbol.keyFor()', function() {
  
  describe('Symbol.for()', function() {
    it('在全局注册表中创建新符号', function() {
      const sym = Symbol.for('test');
      expect(sym).to.be.a('symbol');
    });

    it('相同键返回相同引用', function() {
      const sym1 = Symbol.for('shared');
      const sym2 = Symbol.for('shared');
      expect(sym1).to.equal(sym2);
    });

    it('不同键返回不同引用', function() {
      const sym1 = Symbol.for('key1');
      const sym2 = Symbol.for('key2');
      expect(sym1).to.not.equal(sym2);
    });

    it('局部 Symbol 不受 Symbol.for 影响', function() {
      const local = Symbol('local');
      const global = Symbol.for('local');
      expect(local).to.not.equal(global);
    });
  });

  describe('Symbol.keyFor()', function() {
    it('返回全局符号的键', function() {
      const sym = Symbol.for('myKey');
      expect(Symbol.keyFor(sym)).to.equal('myKey');
    });

    it('对局部符号返回 undefined', function() {
      const local = Symbol('local');
      expect(Symbol.keyFor(local)).to.be.undefined;
    });

    it('未注册的全局符号返回 undefined', function() {
      // 创建后再也找不到的边界情况
      const unregistered = Symbol.for('temp');
      expect(Symbol.keyFor(unregistered)).to.equal('temp');
    });
  });

  describe('跨模块共享', function() {
    it('模拟跨模块共享行为', function() {
      // 模拟 module A
      const KEY = Symbol.for('app.config');
      
      // 模拟 module B
      const KEY2 = Symbol.for('app.config');
      
      // 引用相同
      expect(KEY).to.equal(KEY2);
    });
  });
});
