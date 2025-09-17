const { expect } = require('chai');

describe('Object.prototype 原型方法', function() {
  describe('Object.prototype.hasOwnProperty(key)', function() {
    it('验证自有属性', function() {
      let proto = { hi: 1 };
      let obj = Object.create(proto, { a: { value: 1, enumerable: false } });

      // 验证自有属性
      expect(obj.hasOwnProperty('a')).to.true;
      expect(obj.hasOwnProperty('hi')).to.false;
    });
  });
  describe('Object.prototype.isPrototypeOf(children)', function() {
    it('验证对象的原型', function() {
      let proto = { hi: 1 };
      let children = Object.create(proto);

      //注意该方法是验证当前对象是否是传入对象的原型!!!
      expect(Object.prototype.isPrototypeOf(proto)).to.true;
      expect(proto.isPrototypeOf(children)).to.true;
    });
  });
  describe('Object.prototype.propertyIsEnumerable(key)', function() {
    it('验证是自有属性且可枚举', function() {
      let proto = { hi: 1 };
      let obj = Object.create(proto, { a: { value: 1, enumerable: false } });
      let obj1 = Object.create(proto, { a: { value: 1, enumerable: true } });

      // 验证自有属性
      expect(obj.propertyIsEnumerable('a')).to.false;
      expect(obj1.propertyIsEnumerable('a')).to.true;
    });
  });
  describe('Object.prototype.toString()', function() {
    it('隐式转换为字符串时触发', function() {
      let obj = { foo: 1 };
      expect(obj + '').to.equal('[object Object]');
    });
    it('字符串模板触发 toString 而非 valueOf', function() {
      let obj = {
        foo: 1,
        toString() {
          return 'obj';
        },
        valueOf() {
          return 1;
        }
      };
      expect(`${obj}`).to.equal('obj');
    });
    it('+ 操作先触发  valueOf 然后是 toString', function() {
      let obj = {
        foo: 1,
        toString() {
          return 'obj';
        },
        valueOf() {
          return 1;
        }
      };
      expect(obj + 1).to.equal(2);
    });
    it('显示调用', function() {
      let obj = { hi: 1 };

      expect(obj.toString()).to.equal('[object Object]');
    });
    it('采用自定义 toString 覆盖默认行为', function() {
      let obj = {
        hi: 1,
        toString() {
          return 'obj';
        }
      };

      expect(obj.toString()).to.equal('obj');
    });
    describe('数值的 toString 方法', function() {
      it('传入 2-36 的整数实现进制转换', function() {
        let num = Number(100);
        expect(num.toString(2)).to.equal('1100100');
        expect(num.toString(8)).to.equal('144');
        expect(num.toString(16)).to.equal('64');
      });
      it('传入非法数值', function() {
        let num = Number(100);
        // 传入数值非 2-36 抛出错误
        expect(num.toString.bind(100, 1)).throw(
          RangeError,
          /must be between 2 and 36/
        );
        expect(num.toString.bind(100, null)).throw(
          RangeError,
          /must be between 2 and 36/
        );
      });
    });
  });
  describe('Object.prototype.toLocaleString()', function() {
    it('对象装换为本地字符串的默认行为', function() {
      let obj = { hi: 1 };

      // 注意对于一般对象没有影响,主要在 Date 等日期对象中起作用
      expect(obj.toLocaleString()).to.equal('[object Object]');
    });
    it('采用自定义 toLocalString 覆盖默认行为', function() {
      let obj = {
        hi: 1,
        toLocaleString() {
          return 'obj';
        }
      };

      expect(obj.toLocaleString()).to.equal('obj');
    });
  });
  describe('Object.prototype.valueOf()', function() {
    it('显示调用触发求值', function() {
      let obj = { hi: 1 };

      expect(obj.valueOf()).to.include({ hi: 1 });
    });
    it('采用自定义 valueOf 覆盖对象准换为数值的行为', function() {
      let obj = {
        hi: 1,
        valueOf() {
          return 1;
        }
      };

      expect(obj + 1).to.equal(2);
    });
  });
  describe('Object.prototype.toJson()', function() {
    it('JSON.stringify  对象的转换行为,默认此函数不存在', function() {
      let obj = { hi: 1 };

      expect(obj.toJSON).to.undefined;
    });
    it('自定义 toJSON,修改 JSON.stringify 时对象的转换行为', function() {
      let obj = {
        hi: 1,
        toJSON() {
          return 1;
        }
      };

      expect(JSON.stringify(obj)).to.equal('1');
    });
  });
});
