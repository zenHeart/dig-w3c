let r = /\d12/
exports.numberFormat = function (number) {
	let str = number + '';

	return str.replace(/(?!^)(?=(\d{3})+$)/g, ',')
}

/**
 * 将 yyyy-mm-dd 装换为 mm/dd/yyyy 模式
 */
exports.timeConvert = function (str) {
	return str.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1')
}


exports.timeConvert = function (str) {
	return str.replace(/(\d{4})-(\d{2})-(\d{2})/, '$2/$3/$1')
}

/**
 * 删除字符之前之后的空格
 */
exports.strTrim = function (str) {
	// 也可采用 str.replace(/^\s*(.*?)\s*$/g, "$1");
	return str.replace(/^\s+|\s+$/g, '')
}

/**
 * 首字母大写
 */
exports.upperWord = function (str) {
	// 也可采用 str.replace(/^\s*(.*?)\s*$/g, "$1");
	return str.replace(/\b[a-z]/g, str => str.toUpperCase());
}

/**
 * 蛇形变为驼峰,取自 vue-cli 代码
 */
exports.camelWord = function (str) {
	// 也可采用 str.replace(/^\s*(.*?)\s*$/g, "$1");
	return str.replace(/[-\s]+(.)?/g, function (match, c) {
		return c ? c.toUpperCase() : '';
	});

}

// indexof count occurrence of a letter in a string
exports.occurrenceNum = (str, letter) => {
	let count = 0;
	let position = str.indexOf(letter)
	while (position !== -1) {
		count++;
		position = str.indexOf(letter, position + 1)
	}
	return count;
}