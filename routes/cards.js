const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
// Валидация до записи в базу данных
const celebrates = require('../middlewares/celebrates');

router.get('/', getCards);
router.post('/', celebrates.createCard, createCard);
router.delete('/:cardId', celebrates.getCard, deleteCardById);
router.put('/:cardId/likes', celebrates.getCard, likeCard);
router.delete('/:cardId/likes', celebrates.getCard, dislikeCard);

module.exports = router;
