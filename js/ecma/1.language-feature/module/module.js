
/**
 * 验证扩展语法
 */
const {expect} = require('chai');

/*
* 必须在顶层导出模块
* 变量名必须和模块中导出变量一致
* 可以使用 as 重命名
* import 会被提升
* */

//import 属于静态加载,一个模块只能加载一次,多次加载会被覆盖
import {arr as arrValue,foo}  from './test_module';

describe('Module 语法',function(){
    it('import 基本导入',function() {
        expect(arrValue).to.be.deep.equal([1,2,3]);
        expect(foo).to.be.equal(1);
    })
})
