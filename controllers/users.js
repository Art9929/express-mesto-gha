const http2 = require('node:http2');
const User = require('../models/user');

// all users
const getUsers = (req, res) => User.find({}).then((users) => {
  res.status(http2.constants.HTTP_STATUS_OK).send(users);
});

// one user
const getUserById = (req, res) => {
  const { id } = req.params; // req.params - это данные в урле

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(http2.constants.HTTP_STATUS_OK).send(user);
    })
    .catch((user) => {
      if (id !== user._id) {
        return res.status(http2.constants.HTTP_STATUS_NOT_FOUND).send({ message: 'User not found' });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

// create user
const createUser = (req, res) => {
  const newUserData = req.body; // req.body - данные, которые ты отправляешь

  return User.create(newUserData)
    .then((newUser) => { res.status(http2.constants.HTTP_STATUS_CREATED).send(newUser); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

// update profile
const updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
  )
    .then((updateProfile) => {
      res.status(http2.constants.HTTP_STATUS_CREATED).send(updateProfile);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
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
      res.status(http2.constants.HTTP_STATUS_CREATED).send(updateAvatarUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(http2.constants.HTTP_STATUS_BAD_REQUEST).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatar,
};
