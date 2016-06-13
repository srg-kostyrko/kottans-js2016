"use strict";

var assert = require("assert");
var ExtendedPromise = require('../index');

function isSubset(subset, superset) {
  var i, subsetLen;

  subsetLen = subset.length;

  if (subsetLen > superset.length) {
      return false;
  }

  for(i = 0; i<subsetLen; i++) {
    if(contains(superset, subset[i])) {
      return false;
    }
  }
  return true;
}

function contains (arr, result) {
    return arr.indexOf(result) > -1;
}

describe("Promise.some", function(){
    it("should reject on negative number", function(){
        return ExtendedPromise.some([1,2,3], -1)
            .then(assert.fail)
            .caught(Promise.TypeError, function(){
            });
    });

    it("should reject on NaN", function(){
        return ExtendedPromise.some([1,2,3], -0/0)
            .then(assert.fail)
            .caught(Promise.TypeError, function(){
            });
    });

    it("should reject on non-array", function(){
        return ExtendedPromise.some({}, 2)
            .then(assert.fail)
            .caught(Promise.TypeError, function(){
            });
    });

    it("should reject with rangeerror when impossible to fulfill", function(){
        return ExtendedPromise.some([1,2,3], 4)
            .then(assert.fail)
            .caught(Promise.RangeError, function(e){
            });
    });

    it("should fulfill with empty array with 0", function(){
        return ExtendedPromise.some([1,2,3], 0).then(function(result){
            assert.deepEqual(result, []);
        });
    });
});

var RangeError = Promise.RangeError;

describe("Promise.some-test", function () {

    specify("should reject empty input", function() {
        return ExtendedPromise.some([], 1).caught(RangeError, function() {
        });
    });

    specify("should resolve values array", function() {
        var input = [1, 2, 3];
        return ExtendedPromise.some(input, 2).then(
            function(results) {
                assert(testUtils.isSubset(results, input));
            },
            assert.fail
        )
    });

    specify("should resolve promises array", function() {
        var input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        return ExtendedPromise.some(input, 2).then(
            function(results) {
                assert(testUtils.isSubset(results, [1, 2, 3]));
            },
            assert.fail
        )
    });

    specify("should not resolve sparse array input", function() {
        var input = [, 1, , 2, 3 ];
        return ExtendedPromise.some(input, 2).then(
            function(results) {
                assert.deepEqual(results, [void 0, 1]);
            },
            function() {
                console.error(arguments);
                assert.fail();
            }
        )
    });

    specify("should reject with all rejected input values if resolving howMany becomes impossible", function() {
        var input = [Promise.resolve(1), Promise.reject(2), Promise.reject(3)];
        return ExtendedPromise.some(input, 2).then(
            assert.fail,
            function(err) {
                //Cannot use deep equality in IE8 because non-enumerable properties are not
                //supported
                assert(err[0] === 2);
                assert(err[1] === 3);
            }
        )
    });

    specify("should reject with aggregateError", function() {
        var input = [Promise.resolve(1), Promise.reject(2), Promise.reject(3)];
        var AggregateError = Promise.AggregateError;
        return ExtendedPromise.some(input, 2)
            .then(assert.fail)
            .caught(AggregateError, function(e) {
                assert(e[0] === 2);
                assert(e[1] === 3);
                assert(e.length === 2);
            });
    });

    specify("aggregate error should be caught in .error", function() {
        var input = [ExtendedPromise.resolve(1), Promise.reject(2), Promise.reject(3)];
        var AggregateError = Promise.AggregateError;
        return ExtendedPromise.some(input, 2)
            .then(assert.fail)
            .error(function(e) {
                assert(e[0] === 2);
                assert(e[1] === 3);
                assert(e.length === 2);
            });
    });

    specify("should accept a promise for an array", function() {
        var expected, input;

        expected = [1, 2, 3];
        input = Promise.resolve(expected);

        return ExtendedPromise.some(input, 2).then(
            function(results) {
                assert.deepEqual(results.length, 2);
            },
            assert.fail
        )
    });

    specify("should reject when input promise does not resolve to array", function() {
        return ExtendedPromise.some(Promise.resolve(1), 1).caught(TypeError, function(e){
        });
    });

    specify("should reject when given immediately rejected promise", function() {
        var err = new Error();
        return ExtendedPromise.some(Promise.reject(err), 1).then(assert.fail, function(e) {
            assert.strictEqual(err, e);
        });
    });
});
