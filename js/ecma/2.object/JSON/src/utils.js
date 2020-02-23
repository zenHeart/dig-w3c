// 采用 JSON.stringify 过滤特定键
exports.filterKeys = function(obj, keysArr) {
    // 返回过滤后的结果
    return JSON.parse(JSON.stringify(obj, keysArr));
};
exports.filterValues = function(obj,handle) {
    // 返回过滤后的结果
    return JSON.parse(JSON.stringify(obj,handle));
};
