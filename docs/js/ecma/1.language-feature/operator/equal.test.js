const { expect } = require('chai');

//TODO: 详细讲解等号和三目等号的区别
describe('== and ===', function() {
    describe('==', function() {
        it('当 a 和 b 都是对象时采用强相等原则,相同引用则返回 true', function() {
            let a = [1, 2];
            let b = [1, 2];
            let c = a;
            expect(b == a).false;
            expect(c == a).true;
        });
    });
    describe('===', function() {
        it('test number equal string', function() {
            expect(0 == '0').to.true;
            expect(0 == []).to.true;
            expect('0' == []).to.false;
        });
    });
});
