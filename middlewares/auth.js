const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../util/key');

// Верификация Токена
function auth(req, res, next) {
  let token = req.headers.cookie;
  let payload = '';

  if (!token) {
    res.status(401).send({ message: 'Нет токена' });
  } else {
    token = token.split('=');
    payload = jwt.verify(token[1], JWT_SECRET, (err, decoded) => {
      // Неверный токен
      if (err) res.status(401).send({ message: 'Ошибка токена (не верный токен)' });
      return decoded.id;
    });
  }
  req.user = payload;
  return next();
}

module.exports = auth;
