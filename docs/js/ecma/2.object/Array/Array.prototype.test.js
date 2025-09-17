const { expect } = require('chai');

describe('Array.prototype 方法测试', function() {
  describe('fill(value,start,end)', function() {
    // 注意 fill 属于有副作用的操作会直接修改原数组
    it('fill(value) 填充某数组', function() {
      let arr = Array(3).fill(1);

      expect(arr).to.have.members([1, 1, 1]);
    });
    it('fill(value,start,end) 部分填充', function() {
      let arr = Array(3)
        .fill(1)
        .fill(-1, 0, -2);

      expect(arr).to.have.members([-1, 1, 1]);
    });
    it('fill 填充对象时为引用赋值', function() {
      let arr = Array(2).fill([]);

      // 由于 fill 填充为引用,导致 arr[0],arr[1] 指向的是相同的数组 foo
      // 当向 foo 推入 1 时 arr 也会改变
      arr[0].push(1);

      expect(arr).deep.equal([[1], [1]]);
      //  arr[0] arr[1]  指向相同数组
      expect(arr[0]).equal(arr[1]);
    });
  });

  describe('concat(array,...) 合并多个数组返回新数组', function() {
    it('合并数组并返回新数组', function() {
      let arr = [1, 2, 3];
      let arr1 = [4, 5];
      let concatArr = arr.concat(arr1);

      expect(concatArr).to.have.members([1, 2, 3, 4, 5]);
    });
    it('concat 为弱拷贝,保留引用类型', function() {
      let arr = [1, 2, 3];
      let arr1 = [{ value: 4 }, { value: 5 }];
      let concatArr = arr.concat(arr1);

      expect(concatArr).to.deep.have.members([
        1,
        2,
        3,
        { value: 4 },
        { value: 5 }
      ]);
      // 注意此处是引用比较不要使用 deep.equal
      expect(concatArr[3]).to.equal(arr1[0]);
    });
  });
  describe('pop() 出栈', function() {
    it('出栈', function() {
      let arr = [1, 2, 3];
      arr.pop();

      // 注意为左闭右开的截断
      expect(arr).to.deep.equal([1, 2]);
    });
  });
  describe('push(element1[, ...[, elementN]]) 入栈', function() {
    it('入栈', function() {
      let arr = [1, 2, 3];
      arr.push(4, 5);

      // 注意为左闭右开的截断
      expect(arr).to.deep.equal([1, 2, 3, 4, 5]);
    });
  });
  describe('shift(]) 推出队列', function() {
    it('推出队列', function() {
      let arr = [1, 2, 3];
      arr.shift();

      // 注意为左闭右开的截断
      expect(arr).to.deep.equal([2, 3]);
    });
  });
  describe('unshift(element1[, ...[, elementN]]) 推入队列', function() {
    it('推入队列', function() {
      let arr = [1, 2, 3];
      // TODO： 注意队列的推入顺序为从右往左!!!
      arr.unshift(-1, 0);

      // 注意为左闭右开的截断
      expect(arr).to.deep.equal([-1, 0, 1, 2, 3]);
    });
  });
  describe('slice([begin[, end]]) 切片操作', function() {
    it('合并数组并返回新数组', function() {
      let arr = [1, 2, 3];

      // 注意为左闭右开的截断
      expect(arr.slice(1, 2)).to.deep.equal([2]);
    });
  });
  describe('array.splice(start[, deleteCount[, item1[, item2[, ...]]]]) 数组剪切操作', function() {
    beforeEach(function() {
      this.arr = [1, 2, 3];
    });
    it('删除某个区段元素', function() {
      // 从位置 0开始删除 2 个元素
      this.arr.splice(0, 2);

      expect(this.arr).to.deep.equal([3]);
    });
    it('插入新元素', function() {
      // 从位置 0开始删除 2 个元素
      this.arr.splice(0, 0, 2);

      expect(this.arr).to.deep.equal([2, 1, 2, 3]);
    });
    it('删除某位置并替换为新元素', function() {
      // 从位置 0开始删除 2 个元素
      this.arr.splice(0, 1, 2);

      expect(this.arr).to.deep.equal([2, 2, 3]);
    });
  });
  describe('flat([depth]) 数组扁平化', function() {
    // 该函数无副作用
    it('默认一层扁平化', function() {
      let arr = [1, 2, 3, [4, 5]];
      expect(arr.flat()).to.deep.equal([1, 2, 3, 4, 5]);
    });
    it('多层扁平化', function() {
      let arr = [1, 2, 3, [4, 5, [6, 7]]];
      expect(arr.flat(2)).to.deep.equal([1, 2, 3, 4, 5, 6, 7]);
    });
    it('自动取出空元素元素', function() {
      let arr = [1, , 2, 3, , ,];
      expect(arr.flat()).to.deep.equal([1, 2, 3]);
    });
  });
  describe('flatMap(callback(currentValue[, index[, array]])[, thisArg]) 先 map,再 flat', function() {
    it('只扁平化一层', function() {
      let arr = [1, 2, 3];
      expect(arr.flatMap(ele => [[ele ** 2]])).to.deep.equal([[1], [4], [9]]);
    });
  });
  describe('join([separator]) 连接各元素', function() {
    it('默认连接元素采用,', function() {
      let arr = [1, 2, 3];

      expect(arr.join()).to.equal('1,2,3');
    });
    it('利用此特性自动扁平化多层数组', function() {
      let arr = [1, [2, 3], [[4]]];

      expect(
        arr
          .join()
          .split(',')
          .map(ele => parseInt(ele))
      ).to.members([1, 2, 3, 4]);
    });
    it('设定连接符号', function() {
      let arr = [1, 2, 3];

      expect(arr.join('')).to.equal('123');
    });
  });
  describe('reduce(callback(accumulator, currentValue[, index[, array]]), [, initialValue]) 聚合求值', function() {
    it('数据求和', function() {
      let arr = [1, 2, 3];

      let res = arr.reduce((sum, ele) => (sum += ele), 0);
      expect(res).to.equal(6);
    });
    it('扁平化数组', function() {
      let arr = [1, [1, 2, 3], [[1, [2, 3]]]];
    });
  });
  describe('reduceRight(callback(accumulator, currentValue[, index[, array]]), [, initialValue]) 聚合求值,从右向左', function() {
    it('数据求和', function() {
      let arr = [1, 2, 3];

      let res = arr.reduceRight((sum, ele) => (sum += ele), 0);
      expect(res).to.equal(6);
    });
  });
  describe('every(callback(element[, index[, array]])[, thisArg]) 遍历数组判断是否符合某规则', function() {
    it('判断是否所有元素大于某个数', function() {
      let arr = [7, 4, 7, 8];
      let arr1 = [7, 7, 8];
      function arrGtThreshold(threshold, arr) {
        return arr.every(ele => ele > threshold);
      }

      expect(arrGtThreshold(5, arr)).to.false;
      expect(arrGtThreshold(5, arr1)).to.true;
    });
  });
  describe('entries() 返回 [key,value] 迭代器', function() {
    it('返回一个迭代器', function() {
      let arr = [1, 2, 3];
      let iteratorArr = arr.entries();
      for (const [index, element] of iteratorArr) {
        expect(element).to.equal(arr[index]);
      }
    });
  });
  describe('keys() 返回 [key] 迭代器', function() {
    it('返回一个迭代器', function() {
      let arr = [1, 2, 3];
      let iteratorArr = arr.keys();
      for (const index of iteratorArr) {
        expect(index).to.equal(arr[index] - 1);
      }
    });
  });
  describe('values() 返回 [value] 迭代器', function() {
    it('返回一个迭代器', function() {
      let arr = [1, 2, 3];
      let iteratorArr = arr.values();
      for (const value of iteratorArr) {
        expect(value).to.equal(arr[value - 1]);
      }
    });
  });
  describe('forEach(callback(element[, index[, array]])[, thisArg]) 遍历数组执行某操作', function() {
    it('将元素平方', function() {
      let arr = [1, 2, 3];
      function sqrtArr(arr) {
        arr.forEach((ele, index, arr) => {
          arr[index] = ele ** 2;
        });
        return arr;
      }
      expect(sqrtArr(arr)).to.members([1, 4, 9]);
    });
  });
  describe('map(callback(element[, index[, array]])[, thisArg]) 遍历返回新数组', function() {
    it('将元素平方', function() {
      let arr = [1, 2, 3];
      function sqrtArr(arr) {
        return arr.map((ele, index, arr) => ele ** 2);
      }
      expect(sqrtArr(arr)).to.members([1, 4, 9]);
    });
  });
  describe('filter(callback(element[, index[, array]])[, thisArg]) 过滤合法元素', function() {
    it('过滤符合条件的元素', function() {
      let arr = [1, 2, 3, 4, 5];
      // 返回偶数
      function getEvenNum(arr) {
        return arr.filter(ele => !(ele % 2));
      }

      expect(getEvenNum(arr)).to.have.members([2, 4]);
    });
    it('验证返回对象为浅拷贝', function() {
      let arr = [1, 2, 3, { value: 4 }];
      // 返回偶数
      function getObj(arr) {
        return arr.filter(ele => typeof ele === 'object' && ele !== null);
      }

      // 验证是相同的引用
      expect(getObj(arr)[0]).to.equal(arr[3]);
    });
  });
  describe('find(callback(element[, index[, array]])[, thisArg]) 查找符合条件首次出现的元素', function() {
    it('筛选首次出现的元素', function() {
      let arr = [1, 10, 3, 4, 5];
      function getGtThreshold(threshold, arr) {
        return arr.find(ele => ele > threshold);
      }

      expect(getGtThreshold(7, arr)).to.equal(10);
    });
  });
  describe('findIndex(callback(element[, index[, array]])[, thisArg]) 查找符合条件首次出现的元素', function() {
    it('筛选首次出现的元素', function() {
      let arr = [1, 10, 3, 4, 5];
      // 注意不存在返回的是 -1,而非 undefined
      function getGtThresholdIndex(threshold, arr) {
        return arr.findIndex(ele => ele > threshold);
      }

      expect(getGtThresholdIndex(7, arr)).to.equal(1);
    });
  });
  describe('indexOf(searchElement[, fromIndex]) 返回符合索引的元素', function() {
    it('筛选数值元素', function() {
      let arr = [1, 2, 10, 5];

      expect(arr.indexOf(10)).to.equal(2);
    });

    it('筛选对象元素', function() {
      let obj = { a: 1 };
      let arr = [1, 2, obj, 5];

      expect(arr.indexOf(obj)).to.equal(2);
    });
  });
  describe('lastIndexOf(searchElement[, fromIndex]) 返回符合索引的最后一个元素', function() {
    it('筛选数值元素', function() {
      let arr = [1, 2, 10, 5, 10];

      expect(arr.lastIndexOf(10)).to.equal(arr.length - 1);
    });

    it('筛选对象元素', function() {
      let obj = { a: 1 };
      let arr = [1, 2, obj, 5, obj];

      expect(arr.lastIndexOf(obj)).to.equal(arr.length - 1);
    });
  });
  describe('includes(valueToFind[, fromIndex]) 是否包含某元素', function() {
    it('数值筛选', function() {
      let arr = [1, 2, 3];

      expect(arr.includes(1)).to.true;
      expect(arr.includes(4)).to.false;
    });
    it('对象引用筛选', function() {
      let obj = { a: 1 };
      let arr = [1, obj, 3];

      expect(arr.includes(obj)).to.true;
      expect(arr.includes({ a: 1 })).to.false;
    });
    it('特定位置开始筛选', function() {
      let arr = [1, 2, 3];

      // 从索引为 1 的位置筛选
      expect(arr.includes(2, 1)).to.true;
      expect(arr.includes(2, -2)).to.true;
      expect(arr.includes(2, -1)).to.false;
    });
  });

  describe('reverse() 翻转数组', function() {
    it('翻转元素', function() {
      let arr = [1, 2, 3];
      arr.reverse();
      expect(arr).to.deep.equal([3, 2, 1]);
    });
  });
  describe('sort([compareFunction(firstEl,secondEl)]) 按照比对函数进行排序', function() {
    it('sort 不传值将元素转为字符串按照字典比较', function() {
      let arr = [9, 80, 20, 30, 40];

      arr.sort();
      expect(arr).to.deep.equal([20, 30, 40, 80, 9]);
    });
    it('升序排列', function() {
      let arr = [1, 3, 4, 2, 1];

      arr.sort((firstEl, secondEl) => firstEl - secondEl);
      expect(arr).to.deep.equal([1, 1, 2, 3, 4]);
    });
  });
  describe('copyWithin(targetIndex,start,end)', function() {
    it('实现对数组的区块修改', function() {
      let arr = [1, 2, 3];
      arr.copyWithin(-1, 0, 3);

      // TODO： 这是一个有副作用的操作！！
      expect(arr).to.have.members([1, 2, 1]);
    });
  });
});

describe('Array.prototype 属性测试', function() {
  describe('length 动态反应数组长度,可读可写', function() {
    it('利用 length 对数组进行截断', function() {
      const SLIP_POINT = 50;
      let arr = new Array(60).fill(1);

      if (arr.length > SLIP_POINT) {
        arr.length = SLIP_POINT;
      }

      expect(arr).to.have.members(new Array(50).fill(1));
    });
    it('length 无法对非数值键截断', function() {
      const SLIP_POINT = 0;
      let arr = new Array(60).fill(1);
      arr.foo = 1;

      if (arr.length > SLIP_POINT) {
        arr.length = SLIP_POINT;
      }

      expect(arr.foo).to.deep.equal(1);
    });
  });

  describe('Symbol.iterator 改变数组 for of 特性', function() {
    it.skip('Symbol.iterator 修改数组迭代时返回的值', function() {
      let arr = [1, 2, 3];

      arr[Symbol.iterator] = function * () {
        yield 1;
      };

      for (let val of arr) {
        expect(val).to.equal(1);
      }
    });
  });
});
