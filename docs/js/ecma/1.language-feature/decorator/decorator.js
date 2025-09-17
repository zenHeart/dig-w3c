const {expect} = require('chai');

describe('decorator',function(){
    it("baisc use",function() {
        @test
        class Foo {
            constructor(){this.a=1}
        }; 

        function test(target) {
            target.isTestable = ture
        }

        expect(Foo.isTestable).to.be.ture;
    })
})


