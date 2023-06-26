const Card = require('../models/card');

// all Cards
const getCards = (req, res) => Card.find({}).then((cards) => res.status(200).send(cards));

// create Card
const createCard = (req, res) => {
  const { name, link } = req.body; // данные, которые отправляем
  return Card.create({ name, link, owner: req.user._id })
    .then((newCard) => { res.status(201).send(newCard); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

// delete card
const deleteCardById = (req, res) => {
  const { cardId } = req.params;

  return Card.deleteOne(cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send(req.params);
    })
    .catch(() => { res.status(500).send({ message: 'Server Error' }); });
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
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send('Вы лайкнули фото');
    })
    .catch(() => { res.status(500).send({ message: 'Server Error' }); });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not found' });
      }
      return res.status(200).send('Вы удалили лайк');
    })
    .catch(() => { res.status(500).send({ message: 'Server Error' }); });
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
