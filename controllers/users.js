const http2 = require('../errors/index');
const User = require('../models/user');

// all users
const getUsers = (req, res) => User.find({}).then((users) => {
  res.status(http2.ok).send(users);
});

// one user
const getUserById = (req, res) => {
  const { id } = req.params; // req.params - это данные в урле

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(http2.notFound).send({ message: 'User not found' });
      }
      return res.status(http2.ok).send(user);
    })
    .catch((user) => {
      if (id !== user._id) {
        return res.status(http2.badRequest).send({ message: 'User not found' });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
};

// create user
const createUser = (req, res) => {
  const newUserData = req.body; // req.body - данные, которые ты отправляешь

  return User.create(newUserData)
    .then((newUser) => { res.status(http2.created).send(newUser); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
};

// update profile
const updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateProfile) => {
      res.status(http2.ok).send(updateProfile);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({ message: 'Переданы некорректные данные!' });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
};

// update Avatar
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
  )
    .then((updateAvatarUser) => {
      res.status(http2.ok).send(updateAvatarUser.avatar);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.badRequest).send({ message: 'Переданы некорректные данные!' });
      }
      return res.status(http2.serverError).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatar,
};
