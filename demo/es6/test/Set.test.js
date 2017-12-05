require('babel-polyfill');
const {expect,should,assert} = require('chai');


describe("Set 测试",function() {
    it("基本用法,利用 Set 实例化空序列",function() {
        //初始化 set
        const s = new Set();
        /**
         * add 方法添加元素
         * 会排出重复值
         */
        [2,3,5,4,5,2,2].forEach( x => s.add(x));
        expect(s.size,"Set 会剔除 [2,3,5,4,5,2,2] 数组中的重复参数,预估尺寸为 4").to.be.equal(4);
    });

    it("传入数组进行 set 赋值",function() {
        //传入数组作为参数
        var s = new Set([1,2,3,1,1]);

        //可以利用 Set 来剔除重复数组
        expect([...s]).to.be.deep.equal([1,2,3]);
    });

    it("验证 set 判断值重复方法",function() {
        //类似 ===
        var s = new Set();

        s.add(NaN);
        s.add(NaN);
        // Nan 只取一次,和 === 判断 NaN 不同有区别
        expect(s.size).to.be.equal(1);

        s.add({});
        s.add({});

        //空对象默认为不相等
        expect(s.size).to.be.equal(3);
    });

    it("测试 set 的方法",function() {
        //初始化 set
        var s = new Set();

        //添加一个元素
        s.add(1);
        //has 证明是否有此元素
        expect(s.has(1)).to.be.true;
        //删除一个值
        s.delete(1);
        expect(s.has(1)).to.be.false;

        //add 中的值表示一个元素
        s.add([1,2,3]);
        expect(s.size).to.be.equal(1);

        //清空素有元素
        s.clear();
        expect(s.size).to.be.equal(0);
    });

    it("测试 set 遍历器",function() {
        //初始化 set
        var s = new Set([1,2,3]);

        //keys 返回 set 对象
        expect([...s.keys()]).to.be.deep.equal([1,2,3]);
        //同上
        expect([...s.values()]).to.be.deep.equal([1,2,3]);
        //entries 返回键名和键值
        expect([...s.entries()]).to.be.deep.equal([[1,1],[2,2],[3,3]]);

        //可以直接利用 foreach 循环元素
        s.forEach(function (value,index) {
            //set 没有键名,所以键名和键值相等
            expect(value).to.be.equal(index);
        });
    });

    it('利用 set 实现集合的运算',function () {
        var a = [1,2,3,4,1];
        var b = [3,4,5,6,6];

        //元素去重
        expect([...new Set(a)]).to.be.deep.equal([1,2,3,4])
        //交集
        let sb = new Set(b);
        expect([...new Set(a)].filter(x => sb.has(x))).to.be.deep.equal([3,4])
        //并集
        expect([...new Set([...a,...b])]).to.be.deep.equal([1,2,3,4,5,6])
        //差集
        expect([...new Set(a)].filter(x => !sb.has(x))).to.be.deep.equal([1,2])

    });
});

