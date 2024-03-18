module.exports.errorLogger = function (err, req, res, next) {
  console.error(err);
  next(err);
};

module.exports.errorHandler = function (err, req, res, next) {
  res.status(500).send(JSON.stringify(err, null, 4));
};
