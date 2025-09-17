var person = 'tom';
var age = 20;
function myTag(strings,personExp,ageExp) {
	var str0 = strings[0];
	var str1 = strings[1];

	var ageStr;
	if(ageExp > 99) {
		ageStr = 'centenarian';
	} else {
		ageStr = 'youngster';
	}
	return str0+personExp+str1+ageStr;
}
var output = myTag`that ${person} is a ${age}`;
console.log(output);

/** 
 * 验证模板字符串 tag 可以为 表达式
 * 注意模板字符串
*/
(function showStr(){
	let res = [].slice.call(arguments).flat().filter((ele)=>ele).join(' ');
	console.log(arguments);
	return res;
})`count${1}${2}`