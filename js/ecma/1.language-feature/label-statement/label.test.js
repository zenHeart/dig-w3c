const {expect, should, assert} = require ('chai');

// TODO: 此处需要私用替身
describe ('label statement', function () {
  it ('break statement in label', function () {
		let a;
		// break 中断了 label 语句块的继续执行
	  l1: {
			a = 1;
			break l1;
			a = 2;
		}
		expect(a).eq(1)
	});
	
  it ('break can stop multi loop statement ', function () {
		let a;
		// break 中断了 label 语句块的继续执行
	  l1: while(1) {
			while(1) {
				a = 1;
				break l1;
				a = 2;
			}
			a = 3;
		}
		expect(a).eq(1)
	});
	
  it ('continue label to jump multi loop', function () {
		let a;
		// break 中断了 label 语句块的继续执行
	  l1: for(let i =0; i<3;i++) {
			for(let j =0;j < 3;j++) {
				a = [i,j];
				continue l1;
			}
		}
		// 由于每次跳转到 l1, j 重新计数导致结果为 [2, 0]
		expect(a).deep.eq([2, 0])
  });

});
