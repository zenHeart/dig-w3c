const { expect } = require('chai');

describe('Object 属性验证', function() {
  describe('存取器属性验证(accessor prototype)', function() {
    it('only getter', function() {
      // 只有 getter
      let obj = {
        get name() {
          return 'tom';
        }
      };
      expect(obj.name).to.equal('tom');
      obj.name = 'jack'; // 此操作无效
      expect(obj.name).to.equal('tom');
    });
    it('getter,setter', function() {
      // 只有 getter
      let obj = {
        _name: 'tom',
        get name() {
          return this._name;
        },
        set name(val) {
          this._name = val;
        }
      };
      expect(obj.name).to.equal('tom');
      obj.name = 'jack'; // 此操作无效
      expect(obj.name).to.equal('jack');
    });
    it('getter,setter 数据属性同时存在', function() {
      // 只有 getter
      let obj = {
        _name: 'tom',
        name: 'jerry',
        get name() {
          return this._name;
        },
        set name(val) {
          this._name = 'new:' + val;
        }
      };
      let obj1 = {
        _name: 'tom',
        get name() {
          return this._name;
        },
        set name(val) {
          this._name = 'new:' + val;
        },
        name: 'jerry'
      };
      /**
       * 按照申明顺序后续属性覆盖前置属性
       * obj 存取器 name 覆盖数据属性 name
       * obj1 数据属性 name 覆盖 存取器 name
       */
      expect(obj.name).to.equal('tom');
      expect(obj1.name).to.equal('jerry');

      obj.name = 'jack'; // 存取器有效
      obj1.name = 'jack'; // 由于存取器被数据属性覆盖,不会触发存取器

      expect(obj._name).to.equal('new:jack');
      expect(obj1._name).to.equal('tom');
    });
  });
});
