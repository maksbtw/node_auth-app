'use strict';

const bcrypt = require('bcrypt');

const { jwt } = require('../utils/jwt.js');
const { userService } = require('./user.service.js');
const { tokensRepository } = require('../entity/tokens.repository.js');

const SALT_ROUNDS = 10;
const REFRESH_TOKEN_COOKIE = 'refreshToken';

const REFRESH_COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: 'none',
  secure: true,
};

function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

async function sendAuthentication(res, user) {
  const normalizedUser = userService.normalize(user);
  const accessToken = jwt.generateAccessToken(normalizedUser);
  const refreshToken = jwt.generateRefreshToken(normalizedUser);

  await tokensRepository.save(user.id, refreshToken);

  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, REFRESH_COOKIE_OPTIONS);

  res.send({ user: normalizedUser, accessToken });
}

module.exports = {
  authService: {
    REFRESH_TOKEN_COOKIE,
    hashPassword,
    comparePasswords,
    sendAuthentication,
  },
};
