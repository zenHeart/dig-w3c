const { expect } = require('chai');

describe('Symbol 作为对象属性键', function() {
  
  describe('基本用法', function() {
    it('使用 Symbol 作为计算属性名', function() {
      const myMethod = Symbol('myMethod');
      const obj = {
        [myMethod]() {
          return 'Hello';
        }
      };

      expect(obj[myMethod]()).to.equal('Hello');
    });

    it('多个 Symbol 属性互不冲突', function() {
      const key1 = Symbol('key1');
      const key2 = Symbol('key2');

      const obj = {
        [key1]: 'value1',
        [key2]: 'value2'
      };

      expect(obj[key1]).to.equal('value1');
      expect(obj[key2]).to.equal('value2');
    });
  });

  describe('Symbol 属性不出现在常规枚举中', function() {
    it('Object.keys() 不包含 Symbol 属性', function() {
      const sym = Symbol('test');
      const obj = { a: 1, [sym]: 2, b: 3 };

      const keys = Object.keys(obj);
      expect(keys).to.deep.equal(['a', 'b']);
      expect(keys).to.not.include('Symbol(test)');
    });

    it('for...in 循环不迭代 Symbol 属性', function() {
      const sym = Symbol('test');
      const obj = { a: 1, [sym]: 2 };
      const iterated = [];

      for (const key in obj) {
        iterated.push(key);
      }

      expect(iterated).to.deep.equal(['a']);
    });

    it('JSON.stringify 忽略 Symbol 属性', function() {
      const sym = Symbol('secret');
      const obj = { name: 'test', [sym]: 'hidden' };

      const json = JSON.stringify(obj);
      expect(json).to.equal('{"name":"test"}');
    });
  });

  describe('Object.getOwnPropertySymbols()', function() {
    it('返回所有 Symbol 属性', function() {
      const a = Symbol('a');
      const b = Symbol('b');
      const obj = { [a]: '1', [b]: '2', c: '3' };

      const symbols = Object.getOwnPropertySymbols(obj);
      expect(symbols).to.have.lengthOf(2);
      expect(symbols).to.include(a);
      expect(symbols).to.include(b);
    });
  });

  describe('Reflect.ownKeys()', function() {
    it('返回所有属性（包括 Symbol）', function() {
      const sym = Symbol('test');
      const obj = { [sym]: 'value', regular: 'normal' };

      const keys = Reflect.ownKeys(obj);
      // 注意：Reflect.ownKeys 按特定顺序返回：数字键 → 字符串键 → Symbol键
      expect(keys).to.include(sym);
      expect(keys).to.include('regular');
    });

    it('Symbol 属性按创建顺序返回', function() {
      const a = Symbol('a');
      const b = Symbol('b');
      const obj = { [b]: '1', [a]: '2' };

      const symbols = Object.getOwnPropertySymbols(obj);
      // 返回顺序与定义顺序一致
      expect(symbols[0]).to.equal(b);
      expect(symbols[1]).to.equal(a);
    });
  });
});

describe('Symbol 私有属性模拟', function() {
  
  it('使用 Symbol 模拟私有属性', function() {
    const _password = Symbol('password');

    class User {
      constructor(name, password) {
        this.name = name;
        this[_password] = password;
      }

      authenticate(input) {
        return this[_password] === input;
      }
    }

    const user = new User('alice', 'secret123');

    // 公有属性可访问
    expect(user.name).to.equal('alice');

    // Symbol 属性外部无法直接访问
    expect(user._password).to.be.undefined;

    // 通过方法访问
    expect(user.authenticate('secret123')).to.be.true;
    expect(user.authenticate('wrong')).to.be.false;
  });

  it('多个 Symbol 属性实现真正的命名空间隔离', function() {
    const _data = Symbol('data');
    const _cache = Symbol('cache');
    const _handlers = Symbol('handlers');

    class Component {
      constructor() {
        this[_data] = { count: 0 };
        this[_cache] = new Map();
        this[_handlers] = [];
      }

      increment() {
        this[_data].count++;
      }
    }

    const comp = new Component();
    expect(comp[_data].count).to.equal(0);
    comp.increment();
    expect(comp[_data].count).to.equal(1);
  });
});

describe('Symbol 避免命名冲突', function() {
  
  it('库扩展点使用 Symbol 避免与用户属性冲突', function() {
    const PluginSymbol = Symbol('plugin');

    class PluginHost {
      constructor() {
        this[PluginSymbol] = [];
        this.plugins = [];
      }

      register(plugin) {
        this[PluginSymbol].push(plugin);
        this.plugins.push(plugin.name);
      }
    }

    // 用户可能不知道内部属性名
    const host = new PluginHost();
    host.register({ name: 'AuthPlugin' });

    expect(host[PluginSymbol]).to.have.lengthOf(1);
    expect(host.plugins).to.deep.equal(['AuthPlugin']);
  });
});
