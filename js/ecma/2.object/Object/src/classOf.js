/**
 * 暴露此函数避免对原始库对象的直接修改
 */
exports.classOf = function(o) {
	if(o === null) return 'null';
	if(o === undefined) return 'undefined';
	return Object.prototype.toString.call(o).slice(8,-1)
}