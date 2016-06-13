class ExtendedPromise extends Promise {
  static map(input) {
    return new this((resolve, reject) => {
      reject('test');
    });
  }
  static some(input){
    return new this((resolve, reject) => {
      reject('test');
    });
  }
  static reduce(input){
    return new this((resolve, reject) => {
      reject('test');
    });
  }
}

module.exports = ExtendedPromise;
