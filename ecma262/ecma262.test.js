describe("7 抽象操作符",function() {
    describe("7.2 测试比较操作",function() {
        it("测试 ==",function () {
            expect([1] == [1]).toBeFalsy();
            expect(null == undefined).toBeTruthy();
        })

    });
});