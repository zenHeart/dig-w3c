const {expect, should, assert} = require ('chai');

//箭头函数
describe ('自动分号插入', function () {
  it ('数组字面量导致分号插入', function () {
    /**
		 * 由于自动分号插入会导致代码变为
		 * let foo = 'foo'[1,2,3].map(ele => ele);
		 */
    let fun = () => {
      let foo = 'foo'[(1, 2, 3)].map (ele => ele);
    };

    expect (fun).throw (/Cannot read property \'map\'/);
  });
  it ('括号表达式会导致分号的连接', function () {
    /**
		 * 注意由于自动插入分号该代码会变为
		 * let foo = 'foo'(foo).toString()
		 */
    let fun = () => {
      let foo = 'foo' (foo).toString ();
    };

    expect (fun).throw (/foo is not defined/);
  });
  it ('return 导致自动分号插入', function () {
    let result = (() => {
      // 注意此处会由于 return 导致自动插入分号抛出结果非对象
      return;
      {
        color: ('white');
      }
    }) ();
    expect (result).to.undefined;
  });

  it ('函数表达式导致的自动插入', function () {
	let func = function() {
		let a = function() {
			return 1
		}
		(a).selfMap(ele => ele*ele);
	}
	expect(func).throw(/a is not defined/)

  });
});
