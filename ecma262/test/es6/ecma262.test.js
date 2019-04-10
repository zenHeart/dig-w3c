const {expect} = require('chai');
describe("7 抽象操作符",function() {
    describe("7.2 == 操作符",function() {
        it('null == undefined',function () {
            expect(null == undefined).to.be.true;
        })
        it("12 == '12'",function() {
            expect(12 == '12').to.be.true;
        })
    });
});