const { expect } = require('chai');

describe('Symbol.isConcatSpreadable', function() {
  
  it('默认数组会被展开', function() {
    const arr = [1, 2];
    const result = [].concat(arr);
    expect(result).to.deep.equal([1, 2]);
  });

  it('设置 isConcatSpreadable 为 false 阻止展开', function() {
    const arr = [1, 2];
    arr[Symbol.isConcatSpreadable] = false;
    const result = [0].concat(arr);
    expect(result).to.deep.equal([0, [1, 2]]);
  });

  it('类数组对象默认不展开', function() {
    const arrayLike = { 0: 'a', 1: 'b', length: 2 };
    const result = [].concat(arrayLike);
    expect(result).to.deep.equal([arrayLike]);
  });

  it('设置 isConcatSpreadable 为 true 使类数组对象可展开', function() {
    const arrayLike = { 0: 'a', 1: 'b', length: 2 };
    arrayLike[Symbol.isConcatSpreadable] = true;
    const result = [].concat(arrayLike);
    expect(result).to.deep.equal(['a', 'b']);
  });
});

describe('Symbol.match / Symbol.replace / Symbol.search', function() {
  
  describe('Symbol.match', function() {
    it('定制 match 行为', function() {
      const validator = {
        [Symbol.match](input) {
          return input.length > 3 ? ['valid'] : null;
        }
      };
      
      expect('Hello'.match(validator)).to.deep.equal(['valid']);
      expect('ab'.match(validator)).to.be.null;
    });
  });

  describe('Symbol.replace', function() {
    it('定制 replace 行为', function() {
      const replacer = {
        [Symbol.replace](string, replacement) {
          return string.replace(/o/g, replacement);
        }
      };
      
      expect('Hello World'.replace(replacer, '-')).to.equal('Hell- W-rld');
    });
  });

  describe('Symbol.search', function() {
    it('定制 search 行为', function() {
      const caseInsensitive = {
        [Symbol.search](string) {
          return string.toLowerCase().indexOf('foo');
        }
      };
      
      expect('JavaScript Foo'.search(caseInsensitive)).to.equal(11);
    });
  });

  describe('Symbol.split', function() {
    it('定制 split 行为', function() {
      const csvParser = {
        [Symbol.split](string) {
          return string.split(',');
        }
      };
      
      expect('a,b,c'.split(csvParser)).to.deep.equal(['a', 'b', 'c']);
    });
  });
});

describe('Symbol.species', function() {
  
  it('默认 species 返回构造函数', function() {
    const arr = [1, 2, 3];
    expect(Array[Symbol.species]).to.equal(Array);
  });

  it('map 等方法使用 species 构造函数', function() {
    class MyArray extends Array {
      static get [Symbol.species]() {
        return Array;
      }
    }

    const myArr = new MyArray(1, 2, 3);
    const result = myArr.map(x => x * 2);
    
    expect(result).to.be.an.instanceof(Array);
    expect(result).to.not.be.an.instanceof(MyArray);
  });
});

describe('Symbol.unscopables', function() {
  
  it('定义 with 语句中排除的属性', function() {
    const obj = {
      a: 1,
      b: 2,
      c: 3,
      [Symbol.unscopables]: {
        a: true
      }
    };

    // 注意：现代 JavaScript 引擎已不推荐使用 with
    // 此测试仅演示 Symbol.unscopables 的工作机制
    const unscopables = obj[Symbol.unscopables];
    expect(unscopables.a).to.be.true;
    expect(unscopables.b).to.be.undefined;
  });
});
