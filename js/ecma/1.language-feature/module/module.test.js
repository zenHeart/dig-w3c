import { a } from './fixture/a.js'

//箭头函数
describe('module',function () {
   it("import test",function () {
       expect(a).toEqual(1);
   });
});

