const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfileUser);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
