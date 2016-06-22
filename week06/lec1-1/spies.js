module.exports = function spy(target, method) {
  let origMethod = target[method];
  let result = {
    count: 0
  };
  target[method] = function () {
    result.count++;
    return origMethod.apply(target, arguments);
  };
  return result;
};
