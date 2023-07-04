const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateProfileUser,
  updateAvatar,
} = require('../controllers/users');
// Валидация до записи в базу данных
const celebrates = require('../middlewares/celebrates');

router.get('/', getUsers);
router.get('/me', getUserById);
router.get('/:id', celebrates.getUser, getUserById);
router.patch('/me', celebrates.updateUser, updateProfileUser);
router.patch('/me/avatar', celebrates.updateAvatar, updateAvatar);

module.exports = router;
