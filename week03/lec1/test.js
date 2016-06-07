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

tape('processing sources', (t) => {

  tape(' ', (st) => {
    let target = {};
    let source = {};
    Object.defineProperty(source, 'test', {
      enumerable: false,
    });
    let result = deepAssign(target, source);
    t.notOk(('test' in target), 'skip non enumerable props');

    st.end();
  })

  t.end();
});
