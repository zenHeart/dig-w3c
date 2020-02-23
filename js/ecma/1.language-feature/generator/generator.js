const {expect} = require('chai');


describe('generator 测试',function(){
    it('function * 申明 generator 函数,next 向下执行函数',function() {
        function * Sum(a,b) {
            return a + b;
        }
        var gSum = Sum(1,2);

        expect(gSum,'执行 Sum() 相当于实例化一个迭代器,并没有真正运行函数').to.be.instanceof(Sum);
        expect(gSum.next(),'利用 next 方法触发函数执行,返回对象,value 属性保存执行结果,done 判断执行是否结束').to.be.deep.equal({value:3,done:true});
        expect(gSum.next(),'继续调用 next 返回 undefined').to.be.deep.equal({value:undefined,done:true});
    });

    it('yield 放在表达式或代码块前,申明函数的执行阶段',function() {
        function * sunMove() {
            yield 'sunrise';
            yield ;//申明一个空的 yield 阶段返回 undefined
            yield 'sundown';
        }
        //实例化一个迭代器
        var g = sunMove();

        /*
        * yield 申明函数阶段
        * next 切换函数阶段*/
        expect(g.next(),'next 切换到第一个 yield 状态,返回对象,value 指代 yield 当前表达式的值,done 表示是否迭代结束').to.be.deep.equal({ value: 'sunrise', done: false });
        expect(g.next(),'next 空的 yiled 表达式 value 为 undefined').to.be.deep.equal({ value: undefined, done: false });
        expect(g.next(),'yield 嵌套在其他表达使用必须带括号').to.be.deep.equal({ value: 'sundown', done: false });
        expect(g.next(),'执行结束后的调用 next 返回 undefined').to.be.deep.equal({ value:undefined, done: true });
        expect(sunMove().next(),'重新实例化一个迭代器').to.be.deep.equal({ value: 'sunrise', done: false });
    })
})


