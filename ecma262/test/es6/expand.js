
/**
 * 验证扩展语法
 */
const {expect} = require('chai');

describe('expand',function() {
    
    describe('bugs',function() { //扩展符号在函数中会出现
        it('undefined function',function() {
            function foo() {
                console.log(arguments)
            }

            let badFunc = () => {
                foo({a:1},...{b:2})
            }
            
            expect(badFunc).to.throw(/undefine function/);
        })

    })
})