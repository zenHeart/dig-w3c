const { expect } = require('chai');
const { flattenArr } = require('./src/utils');
describe('Array', function() {
    describe('扁平化数组', function() {
        it('flattenArr', function() {
            expect(flattenArr([1, 2, [3, 4, [5, 6]], [7, 8, [9]]])).to.deep.eq(
                Array(9)
                    .fill(1)
                    .map((ele, index) => index + 1)
            );
        });
    });
});
