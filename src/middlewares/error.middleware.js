'use strict';

const { ApiError } = require('../utils/ApiError.js');

function errorMiddleware(error, req, res, next) {
  if (error instanceof ApiError) {
    const hasFieldErrors = Object.keys(error.errors).length > 0;

    res.status(error.status).send({
      message: error.message,
      ...(hasFieldErrors && { errors: error.errors }),
    });

    return;
  }

  console.error(error);

  res.status(500).send({ message: 'Internal server error' });
}

module.exports = { errorMiddleware };
