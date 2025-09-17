const {expect,should,assert} = require('chai');

describe.skip("Proxy 测试",function() {
    // describe('验证空对象代理',function() {
    //     let obj = {};
    //     let proxyObj = new Proxy(obj);
        
    //     it('修改代理元对象也改变',function() {
    //         proxyObj.name = 'tom';
    //         expect.apply(obj.name).to.equal('tom');
    //     })

    // }) 

    /**
     * proxy 修改对象 obj 默认 set 和 get 行为
     * 形式为 Proxy(target,handle)
     * target 代理对象
     * handle 代理行为,若为空则是对元对象的操作
     * */
    it("基本示例",function() {
        var obj = new  Proxy({},{
            get: function (target,key,receiver) {
                if(key === 'ret1') {
                    return 1;
                } else {
                    return Reflect.get(target,key,receiver);
                }
            },
            set: function (target,key,value,receiver) {
                if(key === 'set1') {
                    return Reflect.set(target,key,1,receiver);

                } else {
                    return Reflect.set(target,key,value,receiver);
                }
            }
       });

        expect(obj.ret1).to.be.equal(1);
        obj.set1 = 2;
        expect(obj.set1).to.be.equal(1);
    });


    it("基本示例",function() {
        var obj = new  Proxy({},{
            /**
             *
             *  */
            get: function (target,key,receiver) {
                //当对象读取 ret1 属性时返回 1
                if(key === 'ret1') {
                    return 1;
                } else {
                    return Reflect.get(target,key,receiver);
                }
            },
            set: function (target,key,value,receiver) {
                if(key === 'set1') {
                    return Reflect.set(target,key,1,receiver);

                } else {
                    return Reflect.set(target,key,value,receiver);
                }
            }
       });

        expect(obj.ret1).to.be.equal(1);
        obj.set1 = 2;
        expect(obj.set1).to.be.equal(1);
    });

});