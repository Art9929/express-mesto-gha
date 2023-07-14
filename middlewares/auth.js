const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../util/key');

// Верификация Токена
function auth(req, res, next) {
  let token = req.headers.cookie;
  token = token.split('=');
  let payload = '';

  if (!token) {
    return res.status(401).send(req.headers);
  }

  payload = jwt.verify(token[1], JWT_SECRET, (err, decoded) => {
    // Неверный токен
    if (err) res.status(401).send(token[1]);
    return decoded.id;
  });

  req.user = payload;
  return next();
}

module.exports = auth;
