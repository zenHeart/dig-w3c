exports.replaceTemp =  function replaceTemp(temp, obj) {
  let keys = Object.keys(obj);
  let newTemp = temp;

  for(let key of keys) {
    let reg = new RegExp(`{\\s*${key}\\s*}`, 'g')
    console.log(reg);
    newTemp = newTemp.replaceAll(reg, obj[key])
    console.log(newTemp)
  }
  return newTemp;
}


