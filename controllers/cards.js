const {
  ForbiddenError, // 403
  NotFound, // 404
  BadRequest, // 400

  // MODUL http2
  ok, // 200
  created, // 201
} = require('../errors/index');
const Card = require('../models/card');

// all Cards
const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(ok).send(cards))
  .catch(next);

// create Card
const createCard = (req, res, next) => {
  const { name, link } = req.body; // данные, которые отправляем
  return Card.create({ name, link, owner: req.user.id })
    .then((newCard) => { res.status(created).send(newCard); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

// delete card
const deleteCardById = (req, res, next) => {
  const { cardId } = req.params; // req.params - это данные в урле

  return Card.findById(cardId)
    .then((card) => {
      if (!card) throw new NotFound('Несуществующий id карточки!');
      if (card.owner.toString() !== req.user.id) throw next(new ForbiddenError('Нет прав на удаление'));
      // Удаление
      return Card.findByIdAndRemove(cardId);
    })
    .then(() => {
      res.status(ok).send({ message: 'Карточка удалилась!' });
    })
    .catch((err) => {
      if (err === 'CastError') {
        return next(new BadRequest('Некорректный id карточки!'));
      }
      return next(err);
    });
};

// Like Card
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Несуществующий id карточки!'));
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id карточки!'));
      }
      return next(err);
    });
};

// dislikeCard Card
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound('Несуществующий id карточки!'));
      }
      return res.status(ok).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Некорректный id карточки!'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
