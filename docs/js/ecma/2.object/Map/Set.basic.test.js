const {expect, should, assert} = require ('chai');

describe ('Set 基础', function () {
  describe('Set 实例化',function() {
    it('必须携带 new 操作符',function() {
      expect(() => Set([1])).throw(/Constructor Set requires.*new.*/)
    })
    it('不能初始化对象',function() {
      expect(() => new Set({a:1})).throw(/is not iterable/)
    })
    it('可以初始化字符串',function() {
      expect(new Set('12').size).equal(2)
    })
  })
  describe ('Set 属性', function () {
    it ('size', function () {
      // 验证返回元素个数为 4
      expect (new Set ([1, 2, 3, 4]).size).equal (4);
    });
    it ('Symbol.species', function () {
      // 验证指向 Set 自身
      expect (Set[Symbol.species]).equal (Set);
    });
    it ('Symbol.iterator', function () {
      // 验证指向 values 方法
      expect (Set.prototype[Symbol.iterator]).equal (Set.prototype.values);
    });
  });

  describe ('set 方法', function () {
    beforeEach (function () {
      this.set = new Set ([1, 2, 3, 4]);
    });
    it ('add', function () {
      this.set.add (5);
      expect ([...this.set]).deep.equal ([1, 2, 3, 4, 5]);
      // add 不会添加重复元素
      this.set.add (5);
      expect ([...this.set]).deep.equal ([1, 2, 3, 4, 5]);
    });
    it ('delete', function () {
      this.set.delete (4);
      expect ([...this.set]).deep.equal ([1, 2, 3]);
    });
    it ('clear', function () {
      this.set.clear ();
      expect (this.set.size).equal (0);
    });
    it ('has', function () {
      expect (this.set.has (1)).true;
      //不要检查引用对象,除非存储了该引用
      let ref = {a:1}
      this.set.add({a:1})
      expect(this.set.has({a:1})).false

      // 保存引用对象
      this.set.add(ref)
      expect(this.set.has(ref)).true
    });
    it('values',function() {
        let iterator = this.set.values()
        expect(iterator.next()).deep.equal({
            value:1,
            done:false
        })
        expect(iterator.next()).deep.equal({
            value:2,
            done:false
        })
    })
    it('keys',function() {
        let iterator = this.set.keys()
        expect(iterator.next()).deep.equal({
            value:1,
            done:false
        })
        expect(iterator.next()).deep.equal({
            value:2,
            done:false
        })
        // keys 和 values 是同一个函数
        expect(this.set.keys).equal(this.set.values)
    })
    it('entries',function() {
        let iterator = this.set.entries()
        expect(iterator.next()).deep.equal({
            value:[1,1],
            done:false
        })
        expect(iterator.next()).deep.equal({
            value:[2,2],
            done:false
        })
    })
    it('forEach',function () {
        // TODO: 注意 map index 不是索引值,而是 value 的值！！！
        this.set.forEach((ele,index,arr) => {
            expect(ele).equal(index)
        })
      })
  });
});
