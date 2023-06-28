const router = require('express').Router();
const http2 = require('../errors/index');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => {
  res.send('Hello, World!');
});
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res) => res.status(http2.notFound).send({ message: 'Такой страницы не существует!' }));

module.exports = router;
