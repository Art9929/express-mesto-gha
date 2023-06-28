const http2 = require('node:http2');
const Card = require('../models/card');

// all Cards
const getCards = (req, res) => Card.find({}).then((cards) => {
  res.status(http2.constants.HTTP_STATUS_OK).send(cards);
});

// create Card
const createCard = (req, res) => {
  const { name, link } = req.body; // данные, которые отправляем
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => { res.status(http2.constants.HTTP_STATUS_CREATED).send(newCard); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

// delete card
const deleteCardById = (req, res) => {
  const { cardId } = req.params; // req.params - это данные в урле

  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send({ message: 'Карточка удалена!' });
    })
    .catch((card) => {
      if (cardId !== card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

// Like Card
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send({ message: 'Вы лайкнули фото' });
    })
    .catch(() => { res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }); });
};

// dislikeCard Card
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'Card not found' });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send('Вы удалили лайк');
    })
    .catch(() => { res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' }); });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
