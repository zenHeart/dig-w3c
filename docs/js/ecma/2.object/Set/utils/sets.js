/**
 * 利用 Set 对象实现集合操作
 */
exports.setsOperation = {
  /**
     * 判断子集
     */
  isSuperSet (set, subset) {
    for (let ele of subset) {
      if (!set.has (ele)) {
        return false;
      }
    }
    return true;
  },
  /**
     * 合并集合 A∪B
     */
  union (setA, setB) {
    let _union = new Set (setA);
    for (let ele of setB) {
      _union.has (ele) || _union.add (ele);
    }
    return _union;
  },
  /**
     * 取集合 A∩B 
     */
  intersection (setA, setB) {
    let _intersection = new Set ();
    for (let ele of setB) {
      setA.has (ele) && _intersection.add (ele);
    }
    return _intersection;
  },
  /**
     * 取集合 A-B
     */
  difference (setA, setB) {
    let _difference = new Set (setA);
    for (let ele of setB) {
      _difference.delete (ele);
    }
    return _difference;
  },
};

/**
 * 数组去重
 */
exports.clearDuplicate = function (arr) {
  return [...new Set (arr)];
};

/**
 * 计算字符串中不重复字符数量
 */
exports.calcChars = function (str) {
    return new Set(str).size
};
