const { expect, should, assert } = require('chai');

describe('Date 原型方法验证', function () {
  describe('toLocaleTimeString', function () {
    it('格式化区间的错误', function () {
      let res = new Date(1580486420538).toLocaleTimeString('en-US', {
        hour12: false
      });
      // 注意在 chrome 报错返回 24:00:20
      expect(res).eq('24:00:20')
    });
    
    // 详见 https://stackoverflow.com/questions/60655166/tolocaledatestring-returns-unexpected-formatted-time
    it('en-GB 修复此问题', function () {
      let res = new Date(1580486420538).toLocaleTimeString('en-GB', {
        hour12: false
      });  
      // 注意在 chrome 报错返回 24:00:20
      expect(res).eq('00:00:20')
    });
  });
});
