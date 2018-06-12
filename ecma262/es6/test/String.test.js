require('babel-polyfill');
const {expect,should,assert} = require('chai');

describe("测试 String 对象",function() {
    it("String 表示法",function() {
        //转义字符方式
        expect('\z').to.be.equal('z');
        //16 进制
        expect('\x7A').to.be.equal('z');
        //utf-8
        expect('\u007A').to.be.equal('z');
        //utf-16
        expect('\u{7A}').to.be.equal('z');
    });
    it("测试字符集识别问题",function () {
        var s = "𠮷";

        expect(s.length).to.be.equal(2);

        expect(s.codePointAt(0)).to.be.equal(134071);
    })
});