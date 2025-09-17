const {expect, should, assert} = require ('chai');

describe ('WeakWeakSet 基础', function () {
  describe ('WeakSet 实例化', function () {
    it ('不支持基本类型', function () {
      expect (() => new WeakSet ([1, 2])).to.throw (
        /Invalid value used in weak set/
      );
    });
  });

  describe ('WeakWeakSet 方法', function () {
    beforeEach (function () {
      this.a = {a: 1};
      this.b = {b: 1};
      this.weakSet = new WeakSet ([this.a, this.b]);
    });
    it ('add', function () {
      let c = {c: 3};
      this.weakSet.add (c);
      expect (this.weakSet.has (c)).true;
    });
    it ('delete', function () {
      this.weakSet.delete (this.a);
      expect (this.weakSet.has (this.a)).false;
    });
    // TODO: clear 方法还没有支持
    it ('clear', function () {
      expect(() => this.weakSet.clear()).throw(/this\.weakSet\.clear is not a functio/)
    });
    it ('has', function () {
      expect (this.weakSet.has (this.a)).true;
      expect (this.weakSet.has (this.b)).true;
    });
  });
});
