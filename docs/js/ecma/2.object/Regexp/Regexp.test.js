const {expect} = require ('chai');

describe ('Regexp', function () {
  describe ('Regexp.$1-9 指代 str.replace,str.natch 匹配的捕获组', function () {
    it ('match 触发 RegExp.$1-9 修改', function () {
      let r = /(\d)(\d{2})/;
      let str = '1234-343';
      str.match (r);

      expect (RegExp.$1).to.equal ('1');
      expect (RegExp.$2).to.equal ('23');
    });
  });
});
