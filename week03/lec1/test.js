const tape = require('tape');
const deepAssign = require('.');

tape('processing target', (t) => {
  t.throws(() => deepAssign(undefined), TypeError, 'throws TypeError for undefined');
  t.throws(() => deepAssign(null), TypeError, 'throws TypeError for null');

  t.ok((deepAssign(true) instanceof Boolean), 'converts boolean primitive to object');
  t.ok((deepAssign(2) instanceof Number), 'converts number primitive to object');
  t.ok((deepAssign('test') instanceof String), 'converts string primitive to object');

  let input, result;

  input = Symbol('test');
  result = deepAssign(input);
  t.ok((result instanceof Symbol), 'returns new Symbol');
  t.notEqual(result, input, 'returns new Symbol');
  t.equal(result.toString(), 'Symbol(test)', 'new symbol should have the same key');

  input = {};
  result = deepAssign(input);
  t.equal(result, input, 'does not change initial object');

  t.end();
});

tape('skip non enumerable props', (t) => {
  let target = {};
  let source = {};
  Object.defineProperty(source, 'test', {
    enumerable: false
  });
  let result = deepAssign(target, source);
  t.notOk(('test' in result), ' ' );

  t.end();
});

tape('key order should be preserved', (t) => {
  let target = {};
  let source = {};
  source.c = true;
  source.a = true;
  let result = deepAssign(target, source);
  t.deepEquals(Object.keys(result), ['c', 'a'], ' ');
  t.end();
});

tape('it adds new properties', (t) => {
  let target = {};
  let source = {};
  source.a = true;
  let result = deepAssign(target, source);
  t.ok(result.a, ' ');
  t.end();
});

tape('extends objects with new props', (t) => {
  let target = {
    a: {
      d: true
    }
  };
  let source = {
    a: {
      c: 2
    }
  };
  let result = deepAssign(target, source);
  t.deepEquals(result, {a: {c: 2, d: true}},  ' ');
  t.end();
});

tape('it overwrites properties with primitive values', (t) => {
  let target = {
    a: {
      d: true
    }
  };
  let source = {
    a: true
  };
  let result = deepAssign(target, source);
  t.ok(result.a, ' ');
  t.end();
});

tape('clones Date objects', (t) => {
  const date = new Date();
  let target = {};
  let source = {
    a: date
  };
  let result = deepAssign(target, source);
  t.ok((result.a instanceof Date), 'date object is created');
  t.notEquals(result.a, source.a, 'date object is different');
  t.equals(result.a.getTime(), source.a.getTime(), 'date object has same timestamp');
  t.end();
});

tape('clones RegExp objects', (t) => {
  const rx = new RegExp('.*?', 'i');
  let target = {};
  let source = {
    a: rx
  };
  let result = deepAssign(target, source);
  t.ok((result.a instanceof RegExp), 'RegExp object is created');
  t.notEquals(result.a, source.a, 'RegExp object is different');
  t.equals(result.a.toString(), source.a.toString(), 'RegExp object has same pattern');
  t.end();
});

tape('works with subclasses of native objects', (t) => {
  class MyDate extends Date {}
  let target = {};
  let source = {
    a: new MyDate()
  };
  let result = deepAssign(target, source);
  t.ok((result.a instanceof MyDate), ' ');
  t.end();
});

tape('works with objects created with Object.crete(null)', (t) => {
  let target = Object.create(null);
  let source = Object.create(null);
  source.a = true;
  let result = deepAssign(target, source);
  t.ok(result.a, ' ');
  t.end();
});

tape('works with gettters', (t) => {
  let target = {};
  let source = {
    _x: true,
    get x() {
      return this._x;
    }
  };
  console.log(source);
  let result = deepAssign(target, source);
  console.log(result);
  t.ok(result.x, ' ');
  t.end();
});
