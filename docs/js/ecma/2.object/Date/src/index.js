exports.beforeMonth = function (t) {
  const d = new Date(t);
  d.setMonth(d.getMonth() - 1);
  return d;
}

