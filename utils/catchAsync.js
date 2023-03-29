// Wrapper function to catch any errors with Async functions
// This will replace having try-catch around
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  };
};
