const { expect, should, assert } = require('chai');

//箭头函数
describe('delete 运算符', function() {
    it('delete 只删除键和值的关系,不清空值', function() {
        let obj = {
            info: {
                foo: 1,
                bar: 2
            }
        };
        let ref = obj.info;

        expect(delete obj.info).to.true;
        expect(obj).to.deep.equal({});
        // 内部值由于存在其他引用并未被删除
        expect(ref).to.deep.equal({
            foo: 1,
            bar: 2
        });
    });
    it('delete 无法删除 configurable 为 false 的属性', function() {
        let obj = {};
        Object.defineProperty(obj, 'foo', {
            value: 10,
            configurable: false,
            writable: true,
            enumerable: true
        });
        // 无法删除不可配置属性
        try {
          expect(delete obj.foo).to.false;
        } catch(e) {}
        expect(obj.foo).to.eq(10);
    });
    it('delete 对于不存在属性删除返回 true', function() {
        let obj = {};
        expect(delete obj.foo).to.true;
    });
    it('delete 只删除自有属性', function() {
        let obj = {
            foo: 2,
            __proto__: {
                foo: 1
            }
        };
        expect(obj.foo).to.eq(2);
        // 删除自有属性
        expect(delete obj.foo).to.true;
        // 无法删除原型属性
        expect(delete obj.foo).to.true;
        expect(obj.foo).to.eq(1);
    });
});
