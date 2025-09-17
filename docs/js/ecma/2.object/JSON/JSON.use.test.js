const { expect } = require('chai');
const utils = require('./src/utils');

describe('JSON API 用例', function() {
    describe('根据键名筛选内容', function() {
        it('filterKeys', function() {
            expect(
                utils.filterKeys(
                    {
                        foo: 1,
                        bar: 2
                    },
                    ['foo']
                )
            ).to.deep.equal({
                foo: 1
            });
        });
    });

    describe('根据键值筛选内容', function() {
        it('filterValues', function() {
            expect(
                utils.filterValues(
                    {
                        foo: 1,
                        bar: 2,
                        baz: '1'
                    },
                    // 注意 undefined 则会丢弃该键
                    (key, val) => (typeof val !== 'string' ? val : undefined)
                )
            ).to.deep.equal({
                foo: 1,
                bar: 2
            });
        });
    });

    describe('格式化输出', function() {
        it('采用空格格式化输出', function() {
            expect(
                JSON.stringify(
                    {
                        foo: 1,
                        bar: 2
                    },
                    null,
                    2
                )
            ).to.deep.equal(`{\n  "foo": 1,\n  "bar": 2\n}`);
        });
        it('采用其他占位符格式化输出', function() {
            expect(
                JSON.stringify(
                    {
                        foo: 1,
                        bar: {
							baz:1
						}
                    },
                    null,
                    '*'
                )
            ).to.deep.equal(`{\n*"foo": 1,\n*"bar": {\n**"baz": 1\n*}\n}`);
        });
    });
});
