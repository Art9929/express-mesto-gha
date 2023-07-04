const jwt = require('jsonwebtoken');
const JWT_SECRET = require('./key');

// Создаем Токен
const generateToken = (id) => jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' }); // токен на 7 дней

module.exports = {
  generateToken,
};
