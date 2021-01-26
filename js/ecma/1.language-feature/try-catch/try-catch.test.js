const {expect} = require ('chai');
const sinon = require ('sinon');

describe ('try catch', function () {
  describe ('optional catch', function () {
    it ('can ignore catch', function () {
      function ignoreCatch(cb) {
        try {
          throw new Error('optional catch')
        }
        catch {
          cb()
        }
      }
      let spy = sinon.spy();

      ignoreCatch(spy);
      expect(spy.called).to.true
    });

    it ('useed in json parser', function () {
      function ignoreCatch(cb) {
        let d;
        try {
          d = JSON.parse('{a: 1}')
        }
        catch {
          d = 1
          cb(d)
        }
      }
      let spy = sinon.spy();

      ignoreCatch(spy);
      expect(spy.calledWith(1)).to.true
    });
  });
});
