const { expect } = require('chai');

describe('lexical-scope', function() {
    describe('验证词法作用域', function() {
        it('右引用的值取决于词法作用域而非运行时', function() {
            function printSomething() {
                return something;
            }
            function invokePrintSomething() {
                var something = 3;
                return printSomething();
            }
            var something = 2;

            let res = invokePrintSomething(); // 此值为 2 而非 3 结果取决于申明时的词法环境
            expect(res).eq(2);
        });
    });
});
