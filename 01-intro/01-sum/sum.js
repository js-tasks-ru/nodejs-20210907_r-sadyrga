function sum(a, b) {
  const aIsNumber = isNumber(a);
  const bIsNumber = isNumber(b);

  if (aIsNumber && bIsNumber) {
    return a + b;
  }

  if (!aIsNumber && !bIsNumber) throw new TypeError('arguments are not numbers');
  if (!aIsNumber) throw new TypeError('first argument is not a number');
  throw new TypeError('second argument is not a number');
}

function isNumber(variable) {
  return typeof variable === 'number';
}

module.exports = sum;
