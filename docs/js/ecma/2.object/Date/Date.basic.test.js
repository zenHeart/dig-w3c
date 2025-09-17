const {expect, should, assert} = require ('chai');

describe ('Date 基础', function () {
  describe ('Date 实例化', function () {
    it ('不采用 new 调用返回字符串', function () {
      let d = Date (0);
      expect (d).is.string;

      expect (d).include (new Date ().getFullYear ().toString ());
      //无论传什么参数均返回当前时间的字符串
      expect (Date ('asdf')).include (new Date ().getFullYear ().toString ());
    });
    describe ('采用 new,返回 date 示例支持多种初始化模式', function () {
      it ('new Date() 返回当前时间', function () {
        expect (new Date ().toLocaleDateString()).include (new Date ().getFullYear ());
      });
      it ('new Date(10), ms级时间戳', function () {
        expect (new Date (10).toLocaleDateString()).include ('1970');
      });
      it ('new Date(), ms级时间戳', function () {
        expect (new Date (10).toLocaleDateString()).include ('1970');
      });


    });
  });
});
