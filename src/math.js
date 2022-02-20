const calculateSum = (a, b) => a + b + 0;

const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) {
        return reject("Number must be non-negative");
      }
      resolve(a + b);
    }, 2000);
  });
};
module.exports = { calculateSum, add };
