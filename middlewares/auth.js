const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../util/key');
const {
  UnauthorizedError, // 401
} = require('../errors/index');

// Верификация Токена
function auth(req, res, next) {
  let token = req.headers.cookie;
  let payload = '';

  if (!token) throw new UnauthorizedError('Нет токена');
  else {
    try {
      token = token.split('=');
      payload = jwt.verify(token[1], JWT_SECRET, (err, decoded) => decoded.id);
    } catch {
      return next(new UnauthorizedError('Ошибка токена (не верный токен)'));
    }
  }
  req.user = payload;
  return next();
}

module.exports = auth;
