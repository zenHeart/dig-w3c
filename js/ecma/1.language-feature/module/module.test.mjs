import { expect } from 'chai';

//箭头函数
describe('module',function () {
   it("import test",function () {
      import { a } from './fixture/a.mjs'
       expect(a).to.be.equal(2);
   });
  
});

