/**
 * 查找字符串中符合模式的字符串出现的位置及次数
 * @param {RegExp} pattern 正则模式
 * @str {String} str 字符串
 */
exports.searchAllMatch = function (pattern, str) {
  let obj = {
    match: [],
    times: 0,
  },
    reg = pattern,
    res = null;
  if (!pattern.global) {
    //若非全局模式则设置为全局模式
    reg = new RegExp (pattern, 'g');
  }

  while ((res = reg.exec (str)) !== null) {
    obj.match.push (res);
    obj.times++;
  }
  console.log (obj);
  return obj;
};

/**
 * 验证是否为合法字符串必须满足如下条件
 * 1. 6-12 位
 * 2. 字符集为数字,小写字母,大写字母.且至少包含两种类型字
 */
exports.validPassword = function (str) {
	// let r = /^((?=.*[0-9])(?=.*[a-z])|(?=.*[0-9])(?=.*[A-Z])|(?=.*[a-z])(?=.*[A-Z]))([0-9a-zA-Z]){6,12}$/g;
	let r = /^(?!^[0-9]{6,12}$)(?!^[a-z]{6,12}$)(?!^[A-Z]{6,12}$)([0-9a-zA-Z]){6,12}$/g;
  return r.test (str);
};


/**
 * 判断是否为时间格式,支持
 * yyyy-mm-dd
 * yyyy/mm/dd
 * yyyy.mm.dd
 * 
 */
exports.isDateStr = function(str) {
	
	return /^\d{4}([-\.])\d{2}\1\d{2}$/.test(str)
}