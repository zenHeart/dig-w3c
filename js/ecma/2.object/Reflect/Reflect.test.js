const {expect,should,assert} = require('chai');
const sinon = require('sinon')

describe("Reflect 测试",function() {
    it("Reflect 是对象而非构造器",function() {
        expect(typeof Reflect).eq('object')
    });
    describe('Reflect.apply(target, thisArgument, argumentsList)', function () {
        it('target is function', function() {
            var fake = sinon.fake();
            Reflect.apply(fake, this, [1,2,3,4])
            expect(fake.callCount).eq(1)
            expect(fake.args[0]).deep.eq([1,2,3,4])
        })
    })
    describe('Reflect.construct(target, argumentsList, optTarget)', function () {
        function C1(...args) {
            this.a = args
        }
        it('same call new', function() {
            
            let c = Reflect.construct(C1,[1,2,3])
            expect(c.a).deep.eq([1,2,3])
        })
        it('suppot change prototype', function() {
            let c = Reflect.construct(C1,[1,2,3], Array)
            expect(c.a).instanceOf(Array)
        })
    })
    describe('Reflect.has(target, propertyKey)',function() {
        it('test own property', function() {
            let o = {
                a: 1,
                b: undefined
            }
           expect(Reflect.has(o, 'a')).true 
        })
        it('test prototype property', function() {
            let o = {
                a: 1
            }
           expect(Reflect.has(o, 'toString')).true 
        })
    })
    describe('Reflect.get(target, key, receiver)', function () {
        it('get key', function() {
            let o = {
                a: 1
            }
            
            expect(Reflect.get(o , 'a')).to.eq(1)
            
        })
        it('set receiver change key', function() {
            let o = {
                get a() {
                    return this.b
                }
            }
            
            // 当属性为访问器属性时，修改函数执行的 this， 有什么用
            expect(Reflect.get(o , 'a', {
                b: 1
            })).to.deep.eq(1)
        })
   })
    describe('Reflect.set(target, propertyKey, value[, receiver])', function () {
        it('set key', function() {
            let o = {
                a: 1
            }

            Reflect.set(o , 'a', 12)
            
            expect(o.a).to.eq(12)
            
        })
        it('set receiver change key', function() {
            let _b = 1
            let o = {
                _b: 1,
                c: 12,
                set a(val) {
                    _b = val + this.c
                },
                get a() {
                    return _b
                }
            }
            Reflect.set(o , 'a', 12, { c: 18 })

            expect(o.a).to.deep.eq(30)
        })
   })
    describe('Reflect.isExtensible(target)',function() {
        it('check object is extensible', function() {
            let o = {
                a: 1,
            }
           expect(Reflect.isExtensible(o)).true 

           Object.freeze(o)
           expect(Reflect.isExtensible(o)).false 
        })
    })
    describe('Reflect.preventExtensions(target)',function() {
        it('stop obj extensible', function() {
            let o = {
                a: 1,
            }
           expect(Reflect.isExtensible(o)).true 
           Reflect.preventExtensions(o)
           expect(Reflect.isExtensible(o)).false 
        })
    })
    describe('Reflect.ownKeys(target)',function() {
        it('get target ownkeys', function() {
            let o = {
                a: 1,
            }
           expect(Reflect.ownKeys(o)).deep.eq(['a']) 
        })
        it('array get target ownkeys ', function() {
            let o = [1,2,3]
            o['a'] = 12;
           expect(Reflect.ownKeys(o)).deep.eq(['0', '1','2','length','a']) 
        })
    })
    describe('Reflect.defineProperty(target, propertyKey, attributes)', function () {
        it('same call new', function() {
            let o = {
                a: 1
            }
            
            Reflect.defineProperty(o, 'a', {
                value: 2
            })
            let res = Reflect.defineProperty(o, 'b', {
                value: 3
            })
            
            // 创建成功返回 true
            expect(res).to.true
            
            // TODO: 为什么添加的属性无法直接显示
            expect(o).deep.eq({
                a: 2
            })
            expect(o.b).eq(3)
        })
    })
    describe('Reflect.deleteProperty(target, propertyKey)', function () {
        it('remvoe key', function() {
            let o = {
                a: 1
            }
            
            let res = Reflect.deleteProperty(o, 'a')
            expect(res).to.true
            
            expect(o).deep.eq({})
        })
        it('object freeze return false', function() {
            let o = {
                a: 1
            }
            Object.freeze(o)

            
            let res = Reflect.deleteProperty(o, 'a')
            expect(res).to.false
            
            expect(o).deep.eq({a :1} )
        })
    })
    describe('Reflect.getOwnPropertyDescriptor(target, propertyKey)', function () {
        it('getOwnPropertyDescriptor', function() {
            let o = {
                a: 1
            }
            
            expect(Reflect.getOwnPropertyDescriptor(o , 'a')).deep.eq({
                configurable: true,
                writable: true,
                value: 1,
                enumerable: true
            })
            
        })
   })
    describe('Reflect.getPrototypeOf(target)', function () {
        it('getPrototypeOf', function() {
            let o = {
                a: 1
            }
            
            expect(Reflect.getPrototypeOf(o)).eq(Object.prototype)
            
        })
   })
    describe('Reflect.setPrototypeOf(target, prototype)', function () {
        it('Reflect.setPrototypeOf', function() {
            let o = {
                a: 1
            }

            expect(Reflect.getPrototypeOf(o)).eq(Object.prototype)
            Reflect.setPrototypeOf(o, null)
            expect(Reflect.getPrototypeOf(o)).null
        })
   })
});