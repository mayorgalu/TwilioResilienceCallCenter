const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SOME_SECRET_STRING';

function createJWT(username) {
  const token = jwt.sign({ username }, SECRET_KEY);
  return token;
}

function verifyToken(token) {
  const data = jwt.verify(token, SECRET_KEY);
  return data;
}

module.exports = {
  createJWT,
  verifyToken,
};
