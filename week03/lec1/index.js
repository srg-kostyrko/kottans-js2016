const toObject = (arg) => {
  let to;
  if (arg instanceof Symbol) {
    let symbolKey = arg.toString().replace(/Symbol\((.*?)\)/, '$1');
    to = Symbol(symbolKey);
  } else {
    to = Object(arg);
  }

  return to;
};
const isPrimitive = (value) => value !== Object(value);
const propertyIsEnumerable = {}.propertyIsEnumerable;
const hasOwnProperty = {}.hasOwnProperty;

const mergeKey = (to,  from) => {
  if (isPrimitive(from)) {
    return from;
  } else if (isPrimitive(to)) {
    if (from instanceof Date || from instanceof RegExp || from instanceof Set || from instanceof Map) {
      return new from.constructor(from);
    } else {
      return deepAssign({}, from);
    }
  } else {
    return deepAssign(to, from);
  }
};

const deepAssign = (target, ...sources) => {
  if (target == null) {
    throw new TypeError();
  }
  let to = toObject(target);

  sources.forEach((source) => {
    if (source == null) return;
    let from = toObject(source);
    Reflect.ownKeys(from).forEach((key) => {
      if (!propertyIsEnumerable.call(from, key)) return;
      if (hasOwnProperty.call(to,  key)) {
        to[key] = mergeKey(to[key], from[key]);
      } else {
        to[key] = mergeKey(undefined, from[key]);
      }
    });
  });

  return to;
};

module.exports = deepAssign;
