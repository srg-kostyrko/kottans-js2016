module.exports = function add(input) {
  if (input === '') return 0;

  let delimiter = /,|\n/ig;

  const delimiterRegEx = /\[(.*?)\]/img;
  if (input.startsWith('//')) {
    let match = delimiterRegEx.exec(input);
    let delimiterParts = [];
    while (match !== null) {
      delimiterParts.push(match[1].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
      match = delimiterRegEx.exec(input);
    }
    delimiter = new RegExp(delimiterParts.join('|'));
    input = input.split("\n").splice(1).join("\n");
  }

  let result = {
    sum: 0,
    negatives: []
  };

  result = input.split(delimiter).reduce((acc, num) => {
    if (num < 0) {
      acc.negatives.push(num);
    } else if (num <= 1000){
      acc.sum += (+num);
    }
    return acc;
  }, result);

  if (result.negatives.length > 0) {
    throw new Error('negatives not allowed: ' + result.negatives.join(','));
  } else {
    return result.sum;
  }
};
