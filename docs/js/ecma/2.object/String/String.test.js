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
    it("显示相等不代表字符编码相等",function () {
        // 详细资料参见 https://dmitripavlutin.com/compare-javascript-strings/
        const e1 = 'é' // ;
        const e2 = 'é';
        const e3 = 'e\u0301'

        expect(e1).not.eq(e2);
        expect(e2).not.eq(e3);
    })
});
