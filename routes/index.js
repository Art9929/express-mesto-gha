const router = require('express').Router();
const {
  NotFound, // 404
} = require('../errors/index');
const auth = require('../middlewares/auth');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const {
  login,
  createUser,
} = require('../controllers/users');

const celebrates = require('../middlewares/celebrates');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);
router.post('/signin', celebrates.loginUser, login);
router.post('/signup', celebrates.registerUser, createUser);
router.use('*', auth, (req, res, next) => next(new NotFound('Такой страницы не существует!')));

module.exports = router;
