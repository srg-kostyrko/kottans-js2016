import test from 'ava';
import add from './index';

test('it should return 0 on empty string', (t) => {
  t.is(add(''), 0);
});

test('it should return value for one value', (t) => {
  t.is(add('5'), 5);
});

test('it should return sum for two values', (t) => {
  t.is(add('2,5'), 7);
});

test('it should return sum for any number of values', (t) => {
  t.is(add('1,2,3,4,1'), 11);
});

test('it should accept line break instead of comma', (t) => {
  t.is(add("1\n2,3"), 6);
});

test('it should support defining delimiter in format “//[delimiter]\n[numbers…]” ', (t) => {
  t.is(add("//[;]\n1;2"), 3);
});

test('it should support defining delimiter of any length', (t) => {
  t.is(add("//[***]\n1***2***3"), 6);
});
test('it should support defining multiple delimiters', (t) => {
  t.is(add("//[*][%]\n1*2%3"), 6);
});

test('it should support defining multiple delimiters longer than 1 character', (t) => {
  t.is(add("//[***][%%%]\n1***2%%%3"), 6);
});

test('it should thrown error "negatives not allowed" with value for negative numbers', (t) => {
  t.throws(() => add('-1'), 'negatives not allowed: -1');
});

test('it should thrown error "negatives not allowed" with all negative negative numbers', (t) => {
  t.throws(() => add('-1,3,-4'), 'negatives not allowed: -1,-4');
});

test('it should ignore numbers bigger than 1000', (t) => {
  t.is(add('2,1001'), 2);
});
