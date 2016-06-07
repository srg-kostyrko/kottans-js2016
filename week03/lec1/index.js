const toObject = (arg) => {
  let to;
  if (arg instanceof Symbol) {
    let symbolKey = arg.toString().replace(/Symbol\((.*?)\)/, '$1');
    to = Symbol(symbolKey);
  } else {
    to = Object(arg);
  }

  return to;
}

const deepAssign = (target, ...sources) => {
  if (target == null) {
    throw new TypeError();
  }
  let to = toObject(target);

  sources.forEach((source) => {
    if (source == null) return;
    let from = toObject(source);
    Reflect.ownKeys(from).forEach((key) => {
      if (!from.propertyIsEnumerable(key)) return;
    });
  });

  return to;
}

module.exports = deepAssign;
