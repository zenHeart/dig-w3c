exports.flattenArr = function flattenArr(arr) {
    return arr.reduce((accumulator, ele) => {
        if (Array.isArray(ele)) {
            return accumulator.concat(flattenArr(ele));
        } else {
            return accumulator.concat(ele);
        }
    }, []);
};
