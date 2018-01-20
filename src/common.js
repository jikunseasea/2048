const curry = function (fn) {
  let args = [];
  const middleFunc = function (...postArgs) {
    if (postArgs.length === 0) {
      const allArgs = args.slice();
      args = [];
      return fn(...allArgs);
    }
    args.push(...postArgs);
    return middleFunc;
  };
  return middleFunc;
};

export { curry };