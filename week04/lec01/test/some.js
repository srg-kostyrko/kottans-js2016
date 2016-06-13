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
    if(!contains(superset, subset[i])) {
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
            .catch(function(err){
              assert(err instanceof ExtendedPromise.TypeError);
            });
    });

    it("should reject on NaN", function(){
        return ExtendedPromise.some([1,2,3], -0/0)
            .then(assert.fail)
            .catch(function(err){
              assert(err instanceof ExtendedPromise.TypeError);
            });
    });

    it("should reject on non-array", function(){
        return ExtendedPromise.some({}, 2)
            .then(assert.fail)
            .catch(function(err){
              assert(err instanceof ExtendedPromise.TypeError);
            });
    });

    it("should reject with rangeerror when impossible to fulfill", function(){
        return ExtendedPromise.some([1,2,3], 4)
            .then(assert.fail)
            .catch(function(err){
              assert(err instanceof ExtendedPromise.RangeError);
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
        return ExtendedPromise.some([], 1).catch(function(err){
          assert(err instanceof ExtendedPromise.RangeError);
        });
    });

    specify("should resolve values array", function() {
        var input = [1, 2, 3];
        return ExtendedPromise.some(input, 2).then(
            function(results) {
                assert(isSubset(results, input));
            },
            assert.fail
        )
    });

    specify("should resolve promises array", function() {
        var input = [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)];
        return ExtendedPromise.some(input, 2).then(
            function(results) {
                assert(isSubset(results, [1, 2, 3]));
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

    specify("should reject with aggregateError", function() {
        var input = [Promise.resolve(1), Promise.reject(2), Promise.reject(3)];
        var AggregateError = ExtendedPromise.AggregateError;
        return ExtendedPromise.some(input, 2)
            .then(assert.fail)
            .catch(function(e) {
                assert(e instanceof AggregateError);
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
        return ExtendedPromise.some(Promise.resolve(1), 1).catch(function(e){
          assert(e instanceof ExtendedPromise.TypeError);
        });
    });

    specify("should reject when given immediately rejected promise", function() {
        var err = new Error();
        return ExtendedPromise.some(Promise.reject(err), 1).then(assert.fail, function(e) {
            assert.strictEqual(err, e);
        });
    });
});
