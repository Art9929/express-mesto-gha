const http2 = require('../errors/index');
const Card = require('../models/card');

// all Cards
const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(http2.ok).send(cards))
  .catch(() => res.status(http2.serverError).send({ message: 'Server Error' }));

// create Card
const createCard = (req, res) => {
  const { name, link } = req.body; // данные, которые отправляем
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => { res.status(http2.created).send(newCard); })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
};

// delete card
const deleteCardById = (req, res) => {
  const { cardId } = req.params; // req.params - это данные в урле

  return Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(http2.notFound).send({ message: 'Card not found' });
      }
      return res.status(http2.ok).send({ message: 'Карточка удалена!' });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({ message: 'Card not found' });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
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
        return res.status(http2.notFound).send({ message: 'Несуществующий id карточки' });
      }
      return res.status(http2.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({ message: 'Некорректный id карточки' });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
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
        return res.status(http2.notFound).send({ message: 'Несуществующий id карточки' });
      }
      return res.status(http2.ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({ message: 'Некорректный id карточки' });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
