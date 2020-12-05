import { a, changeA } from './fixture/a.js'
import * as b from './fixture/a.js'
import a1 from './fixture/export-as.js'
import { default as d } from './fixture/a'

//箭头函数
describe('module',function () {
   it("import test",function () {
    expect(a).toEqual(1);
   });
   it("export all",function () {
    expect(b).toMatchObject({ a: 1, default: {a: 1}});
   });
   it("import can't exchange",function () {
    let setA = () =>   a = 2
    expect(setA).toThrow(/Assignment to constant variable./);
    // 可以暴露函数修改内部变量
    changeA(12)
    expect(a).toEqual(12)
    // 注意恢复之前的值
    changeA(1)
   });
   it("export as default from other module",function () {
    expect(a1).toEqual(1)
   });
   it(" default as change name",function () {
    expect(d).toEqual({ a: 1 })
   });
});





