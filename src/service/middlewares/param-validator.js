'use strict';

const {HttpCode} = require(`../../constants`);

const checkParamIsInteger = (req, res, next) => {
  const {offerId} = req.params;

  if (!Number.isInteger(Number(offerId))) {
    return res.status(HttpCode.NOT_FOUND)
      .json({
        status: HttpCode.NOT_FOUND,
        message: `Incorrect data sent`
      });
  }

  return next();
};

module.exports = {
  checkParamIsInteger
};
