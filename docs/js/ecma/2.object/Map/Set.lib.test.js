const {expect, should, assert} = require ('chai');
const {setsOperation,clearDuplicate,calcChars} = require ('./utils/sets');

describe ('Set 使用', function () {
  describe ('去重特性', function () {
      it('clearDuplicate 清除数组重复内容',function () {
          let testData = {
              input:[2, 3, 5, 4, 5, 2, 2],
              expect:[2,3,5,4]
          }
          expect(clearDuplicate(testData.input)).to.deep.equal(testData.expect)
        })
     
    it('calcChars 去重并计算字符数量',function() {
        let testData = {
            input:'hello',
            expect:4
        }
        expect(calcChars(testData.input)).equal(testData.expect)
    })
  });

  describe ('set 集合操作:setsOperation', function () {
    beforeEach (function () {
      this.setA = new Set ([1, 2, 3, 4, 5]);
      this.setB = new Set ([6, 7, 8, 4, 5, 1]);
      this.subset = new Set ([4, 5]);
      this.union = new Set ([...this.setA, ...this.setB]);
      this.intersection = new Set (
        [...this.setA].filter (ele => this.setB.has (ele))
      );
      this.difference = new Set (
        [...this.setA].filter (ele => !this.setB.has (ele))
      );
    });
    it ('isSuperSet 判断子集', function () {
      expect (setsOperation.isSuperSet (this.setA, this.subset)).true;
    });
    it ('union 全集', function () {
      setsOperation.union (this.setA, this.subset).forEach (ele => {
        expect (this.union.has (ele)).true;
      });
    });
    it('intersection 交集', function(){
        setsOperation.intersection(this.setA,this.setB).forEach(ele => {
            expect(this.intersection.has(ele)).true
        })
    })
    it('difference 差集', function(){
        setsOperation.difference(this.setA,this.setB).forEach(ele => {
            expect(this.difference.has(ele)).true
        })
    })
  });
});
