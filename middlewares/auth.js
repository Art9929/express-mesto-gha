const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../util/key');

// Верификация Токена
function auth(req, res, next) {
  const token = req.headers.authorization;
  let payload = '';

  if (!token) {
    return res.status(401).send({ message: 'Нет токена' });
  }

  payload = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    // Не верный токен
    if (err) res.status(401).send({ message: 'Ошибка токена (не верный токен)' });
    return decoded.id;
  });

  req.user = payload;
  return next();
}

module.exports = auth;
