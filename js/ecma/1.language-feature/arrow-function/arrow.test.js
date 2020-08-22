const {expect,should,assert} = require('chai');

//箭头函数
describe('[传入参数] => [表达式|代码块] 测试箭头函数',function () {
   it(" () => 表达式,函数返回表达式结果",function () {
       var ret1 = () =>  1;
       expect(ret1()).to.be.equal(1);
   });
   it(" arg => 表达式,可以不带括号 ",function () {
       var autoAdd1 = n => n + 1;
       expect(autoAdd1(1)).to.be.equal(2);
   });
   it(" (arg1,arg2) => 表达式",function () {

       var autoAddn = (n1,n) => n1 + n;
       expect(autoAddn(1,4)).to.be.equal(5);
   });

   //todo 该函数返回非预期
   it("(arg1,arg2,..)=> {代码块},返回代码块结果",function () {
       var squareN = (n) =>{
           let MAX =100;
           n = n**2;
           if(n > MAX) {
               return `calculate result overflow max number ${MAX}`;
           } else {
               return n;
           }
       };

       //todo 返回非预期需要分析
       expect(squareN(2)).to.be.equal(4);
       expect(squareN(500)).to.be.equal('calculate result overflow max number 100');
   })
   it('嵌套箭头函数, 返回函数作为参数', function() {
        // 利用嵌套箭头函数表示科里化
        const add = x => y => x + y
        expect(add(1)).instanceOf(Function)
        expect(add(1)(2)).eq(3)
   })
});
