const { expect } = require('chai');

/**
 * 可以把 Object 提供的静态方法总结为 4 类
 * 创建方法 create
 * 查询方法,keys,getOwnPrototypeDescriptor,getOwnPrototypeDescriptors,getPrototype
 *
 *
 */
describe('Object 静态方法', function() {
    describe('Object.create(proto,prototypesDescriptor)', function() {
        it('只传入 proto', function() {
            let proto = null;
            let obj = Object.create(proto);

            //注意理解 __proto__ 为何为 undefined
            expect(obj.__proto__).to.undefined;
        });

        it('传入 proto,prototypesDescriptor', function() {
            let proto = null;
            let prototypesDescriptor = {
                hi: {
                    value: 42
                }
            };
            let obj = Object.create(proto, prototypesDescriptor);

            expect(obj.__proto__).to.undefined;
            expect(obj).to.own.include({ hi: 42 });
        });

        it('创建 inherit 方法避免对原始对象的直接操作', function() {
            let { inherit } = require('./src/inherit');
            let origin = { hi: () => 1 };

            expect(inherit(origin).__proto__).to.equal(origin);
        });
    });

    describe('Object.defineProperty(object,key,propertyDescriptor)', function() {
        it('在对象上动态添加属性', function() {
            let obj = {};
            Object.defineProperty(obj, 'name', {
                value: 'tom'
            });

            expect(obj).to.have.include({
                name: 'tom'
            });
        });
        it('验证修改类方法后的运行时', function() {
            class A { 
                a() {
                    expect(this).instanceOf(A)
                 } 
            }
            let a;
            let desp = Object.getOwnPropertyDescriptor(A.prototype,'a');
            let val = desp.value;
            desp.value = function (...args) {
                expect(this).to.eq(a)
                // 避免 this 值的丢失
                val.call(this,...args)
            }
            Object.defineProperty(A.prototype,'a',desp);

            a = new A();
            a.a();
        });
        it('check defineProperty overwrite', function() {
           let a = {a:1};
            let desp = Object.getOwnPropertyDescriptor(a,'a');
            Object.defineProperty(a,'a',{
                configurable: desp.configurable,
                enumerable: desp.enumerable,
                get() {
                    return 2
                }
            }) 
            expect(a.a).eq(2)
        });
    });
    describe('Object.defineProperties(object,propertyDescriptors)', function() {
        it('在对象上动态添加多个属性', function() {
            let obj = {};
            Object.defineProperties(obj, {
                name: {
                    value: 'jack'
                }
            });

            expect(obj).to.have.include({
                name: 'jack'
            });
        });
    });

    describe('Object.getOwnPropertyDescriptor(object,key)', function() {
        it('获取对象单个自有属性描述对象', function() {
            let obj = { hi: 1 };
            let obj1 = {
                get name() {
                    return 'tom';
                }
            };

            // 验证自有属性
            expect(Object.getOwnPropertyDescriptor(obj, 'hi')).to.deep.equal({
                value: 1,
                configurable: true,
                writable: true,
                enumerable: true
            });
            expect(Object.getOwnPropertyDescriptor(obj1, 'name'))
                .to.include({
                    configurable: true,
                    enumerable: true,
                    set: undefined
                })
                .own.property('get');
        });
    });
    describe('Object.getOwnPropertyDescriptors(object)', function() {
        it('获取对象所有自有属性描述对象', function() {
            let obj = { hi: 1 };

            // 验证自有属性
            expect(Object.getOwnPropertyDescriptors(obj)).to.deep.equal({
                hi: {
                    value: 1,
                    configurable: true,
                    writable: true,
                    enumerable: true
                }
            });
        });
    });
    describe('Object.keys(object)', function() {
        it('返回对象所有可枚举自有属性', function() {
            let obj = Object.create(
                { a: 1 },
                {
                    bar: {
                        value: 1,
                        enumerable: true
                    },
                    foo: {
                        value: 1,
                        enumerable: false
                    }
                }
            );

            expect(Object.keys(obj)).to.have.members(['bar']);
            expect(Object.keys(obj))
                .to.not.have.members(['foo'])
                .members(['a']);
        });
    });

    describe('Object.getPrototype(object)', function() {
        it('获取对象原型', function() {
            let obj = {};

            expect(Object.getPrototypeOf(obj)).to.equal(Object.prototype);
        });
    });

    describe('Object.preventExtensions(object) 阻止扩展', function() {
        let foo;
        beforeEach(() => {
            foo = {
                bar: 1
            };
        });

        it('阻止对象扩展', function() {
            Object.preventExtensions(foo);
            try {
              foo.baz = 1;
              expect(foo).to.deep.eq({
                  bar: 1
              });
            } catch(e) {
              expect(e).instanceOf(Error)
            }
    
        });
        it('允许修改已有属性', function() {
            Object.preventExtensions(foo);
            foo.bar = 2;
            expect(foo).to.deep.eq({
                bar: 2
            });
        });
        it('允许删除已有属性', function() {
            Object.preventExtensions(foo);
            delete foo.bar;
            expect(foo).to.deep.eq({});
        });
        it('Object.isExtensible 判断扩展', function() {
            expect(Object.isExtensible(foo)).to.true;
            Object.preventExtensions(foo);
            //
            expect(Object.isExtensible(foo)).to.false;
        });
    });
    describe('Object.seal(object) 对象封印', function() {
        let foo;
        beforeEach(() => {
            foo = {
                bar: 1
            };
        });

        it('阻止对象属性添加', function() {
            Object.seal(foo);
            try {
              foo.baz = 1;
              expect(foo).to.deep.eq({
                  bar: 1
              });
            } catch(e) {
              expect(e).instanceOf(Error)
            }
        });
        it('阻止对象属性删除', function() {
            Object.seal(foo);
            try {
              delete foo.bar;
              expect(foo).to.deep.eq({
                  bar: 1
              });
            } catch(e) {
              expect(e).instanceOf(Error)
            }
        });
        it('允许对象属性修改', function() {
            Object.seal(foo);
            foo.bar = 2;
            expect(foo).to.deep.eq({
                bar: 2
            });
        });
        it('isSealed 判断是否封印', function() {
            expect(Object.isSealed(foo)).false;
            Object.seal(foo);
            expect(Object.isSealed(foo)).true;
        });
    });
    describe('Object.freeze(object) 对象冻结', function() {
        let foo;
        beforeEach(() => {
            foo = {
                bar: 1
            };
        });

        it('阻止对象属性添加', function() {
            Object.freeze(foo);
            try {
              foo.baz = 1;
            } catch(e) {
              expect(foo).to.deep.eq({
                bar: 1
              });
            }
        });
        it('isFrozen 判断是否封印', function() {
            expect(Object.isFrozen(foo)).false;
            Object.freeze(foo);
            expect(Object.isFrozen(foo)).true;
        });
    });
    describe('Object.values(object) 返回对象的值', function() {
        it('会按照字典顺序返回值', function() {
            const scrambled = {
                a: '!',
                2: 'e',
                5: 'o',
                1: 'h',
                4: 'l',
                3: 'l'
            };

            const res = Object.values(scrambled).reduce(
                (agg, el) => agg + el,
                ''
            );

            expect(res).to.eq('hello!');
        });
    });
    describe('Object.entries(object)', function() {
        it('return list like [ [key,val], [key1,val1]...]', function() {
            let obj = {
                a: 1,
                b: 2
            }

            let res = Object.entries(obj)

            expect(res).deep.eq([
                ['a' ,1],
                ['b' ,2],
            ])
        });
    });
});
