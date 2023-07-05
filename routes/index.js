const router = require('express').Router();
const http2 = require('../errors/index');
// const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const {
  login,
  createUser,
} = require('../controllers/users');
// Валидация до записи в базу данных
const celebrates = require('../middlewares/celebrates');

// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => {
  res.send('Hello, World!');
});
// router.use('/users', auth, userRoutes);
// router.use('/cards', auth, cardRoutes);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.post('/signin', celebrates.loginUser, login);
router.post('/signup', celebrates.registerUser, createUser);
router.use('*', (req, res) => res.status(http2.notFound).send({ message: 'Такой страницы не существует!' }));

module.exports = router;
