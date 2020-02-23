const { expect } = require('chai');

describe('Array 对象方法测试', function() {
  describe('Array.from(arrayLike[, mapFn[, thisArg]]) 创建数组', function() {
    it('从可迭代对象创建数组', function() {
      let a1 = Array.from([1, 2, 3]);
      let a2 = Array.from(new Set([1, 2, 3, 1, 1]));
      // 利用 from 将字符串拆分为单个字符
      let a3 = Array.from('123');

      expect(a1).to.deep.eq([1, 2, 3]);
      expect(a2).to.deep.eq([1, 2, 3]);
      expect(a3).to.deep.eq(['1', '2', '3']);
    });
    it('通过,length 和 mapFn 创建数组', function() {
      let a = Array.from({ length: 4 }, (ele, index) => index);

      expect(a).to.deep.eq([0, 1, 2, 3]);
    });
    it('通过,length 和 mapFn 创建数组', function() {
      let a = Array.from({ length: 4 }, (ele, index) => index);

      expect(a).to.deep.eq([0, 1, 2, 3]);
    });
    it('通过,length 和 mapFn 创建二维数组', function() {
      let a = Array.from({ length: 4 }, (ele, index) => []);

      a[0].push(1);
      expect(a).to.deep.eq([[1], [], [], []]);
    });
    it('利用 this 改变 mapFn 的执行环境', function() {
      // 注意由于 this 要生效不要使用箭头函数
      let a = Array.from(
        { length: 4 },
        function(ele, index) {
          return index + this.offset;
        },
        {
          offset: 1
        }
      );

      expect(a).to.deep.eq([1, 2, 3, 4]);
    });
  });
  describe('字面量赋值', function() {
    it('[,,,] 由于末尾逗号为可选逗号,只初始化 2 个数据', function() {
      let arr = [, ,];
      let arr1 = [undefined, undefined];

      // 注意此初始化实际上并没有为 arr 分配存储空间只是实例化了一个空数组对象而已！！！
      expect(arr.length).to.equal(arr1.length);
      expect(arr).to.have.members([, ,]);
    });
  });
  describe('Array 构造函数赋值', function() {
    it('new Array(length) 只初始化了 length,并没有开辟空间', function() {
      let arr = new Array(10);

      let newArr = new Array(10).map(ele => 1);

      // 注意由于只设定了数组长度,此时数组的存储空间为空,所以 调用 map 或 forEach 不会有效果
      expect(newArr).to.deep.equal(arr);
    });
    it('new Array(ele,ele1,...)', function() {
      let arr = new Array(1, 2, 3);

      expect(arr).to.members([1, 2, 3]);
    });
    it('可以省略 new 操作符也', function() {
      let arr = Array(1, 2, 3);
      let arr1 = Array(10);

      expect(arr).to.members([1, 2, 3]);
      expect(arr1.length).to.equal(10);
    });
  });
  describe('index', function() {
    it('a[1] === a[1.0] === a["1"]', function() {
      let arr = [0, 1, 2];

      expect(arr[0])
        .to.equal(arr[0.0])
        .to.equal(arr['0']);
    });
    it('支持字符串索引 a["index"] = 1', function() {
      let arr = [];
      arr['index'] = 1;

      expect(arr['index']).to.equal(1);
    });
  });
});
