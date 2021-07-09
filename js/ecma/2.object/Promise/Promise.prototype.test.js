const {expect} = require('chai');
import "core-js/proposals/promise-any"

describe('Promise',function() {
  describe('Promise.any(iterable);',function() {
    it('return the first succes result ',async function() {
      let e1 = new Promise((res,rej ) => setTimeout(() => res(1),1))
      let e2 = new Promise((res,rej )=> setTimeout(()=> res(2),2))
      let e3 = new Promise((res,rej )=> setTimeout(() => res(10),10))


      let res = await Promise.any([e1, e2 , e3])
      expect(res).eq(1)
    })
    it('all fail return fail',async function() {
      let e1 = new Promise((res,rej ) => setTimeout(() => rej(1),1))
      let e2 = new Promise((res,rej )=> setTimeout(()=> rej(2),2))
      let e3 = new Promise((res,rej )=> setTimeout(() => rej(10),10))

      try {
        await Promise.any([e1, e2 , e3])
      } catch (e) {
        expect(e).to.be.instanceOf(Error)
      }
    })
  })
})