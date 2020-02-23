const {expect,should,assert} = require('chai');

describe("测试 Map 对象",function() {
    it("初始化 map",function() {
        const map = new Map();

        const a=  {};

        map.set(a,1);
        expect(map.get(a)).to.be.equal(1);
        //返回 map 总数
        expect(map.size).to.be.equal(1);
        //has 验证对应键是否存在
        expect(map.has(a)).to.be.true;
        //delete 删除一个键
        expect(map.delete(a)).to.be.true;
        //clear 清除所有键
        map.set(a,2);
        map.clear();
        expect(map.size).to.be.equal(0);

        map.set(a,2);
        //keys 返回对应键值的遍历器
        expect([...map.keys()]).to.be.deep.equal([a]);
        //values 返回值的遍历器
        expect([...map.values()]).to.be.deep.equal([2]);
        //entries 返回键名和值的遍历器
        expect([...map.entries()]).to.be.deep.equal([[a,2]]);
        //forEach 遍历元素
        map.forEach((value,key) => expect(map.get(key)).to.be.equal(value));

    });
});