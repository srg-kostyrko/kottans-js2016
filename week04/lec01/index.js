class AggregateError extends Error {}
class TypeError extends Error {}
class RangeError extends Error {}

class ExtendedPromise extends Promise {
  static map(input, mapper) {
    return new this((resolve, reject) => {
      let results = [];
      Promise.resolve(input).then((iterable) => {
        if (!Array.isArray(iterable)) {
          resolve([]);
          return;
        }
        const inputLength = iterable.length;
        const resolveProcessor = index => (val) => {
          Promise.resolve(mapper(val, index))
            .then((val) => {
              results.push(val);
              if (results.length == inputLength) {
                resolve(results);
              }
            });
        }

        let index = 0;
        for (let value of iterable) {
          Promise.resolve(value).then(resolveProcessor(index)).catch((err) => reject(err));
          index++;
        }
      })
      .catch((err) => reject(err));
    });
  }
  static some(input, count) {
    let resolved = 0;
    let rejected = 0;
    let inputLength = 0;
    let results = [];
    let rejectedResults = [];
    let finished = false;

    return new this((resolve, reject) => {
      if (count < 0 || count != count) {
        reject(new TypeError());
        return;
      }

      Promise.resolve(input).then((iterable) => {
        if (!Array.isArray(iterable)) {
          reject(new TypeError());
          return;
        }
        inputLength = iterable.length;

        if (inputLength < count) {
          reject(new RangeError());
          return;
        }
        if (count === 0) {
          resolve([]);
          return;
        }

        const resolveProcessor = (value) => {
          if (finished) return;
          results.push(value);
          resolved++;
          if (resolved == count) {
            resolve(results);
            finished = true;
          }
        };
        const rejectProcessor = (err) => {
          if (finished) return;
          rejected++;
          if (inputLength - rejected <= count - resolved) {
            reject(new AggregateError());
            finished = true;
          }
        };
        for (let value of iterable) {
          Promise.resolve(value).then(resolveProcessor).catch(rejectProcessor);
        }
      }).catch(err => reject(err));
    });
  }
  static reduce(input){
    return new this((resolve, reject) => {
      reject('test');
    });
  }
}

ExtendedPromise.AggregateError = AggregateError;
ExtendedPromise.TypeError = TypeError;
ExtendedPromise.RangeError = RangeError;

module.exports = ExtendedPromise;
