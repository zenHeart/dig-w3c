/**
 * 暴露此函数避免对原始库对象的直接修改
 */
exports.inherit = function(p) {
	if(typeof p !== 'object' || p === null) {
		throw new TypeError('input must a object')
	}

	if(Object.create) {
		return Object.create(p)
	} else {
		let f = function() {}
		f.prototype = p;
		return new f()
	}
}