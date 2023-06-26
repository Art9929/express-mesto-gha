const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');

// respond with "hello world" when a GET request is made to the homepage
router.get('/', (req, res) => {
  res.send('Hello, World!');
});
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
