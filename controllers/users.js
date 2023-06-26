const User = require('../models/user');

// all users
const getUsers = (req, res) => User.find({}).then((users) => res.status(200).send(users));

// one user
const getUserById = (req, res) => {
  const { id } = req.params;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      return res.status(200).send(user);
    })
    .catch(() => { res.status(500).send({ message: 'Server Error' }); });
};

// create user
const createUser = (req, res) => {
  const newUserData = req.body;

  return User.create(newUserData)
    .then((newUser) => { res.status(201).send(newUser); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

// update profile
const updateProfileUser = (req, res) => {
  const { name, about } = req.body;

  return User.updateOne({ name, about })
    .then((updateProfile) => { res.status(201).send(updateProfile); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

// update Avatar
const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  return User.updateOne({ avatar })
    .then((updateAvatarUser) => { res.status(201).send(updateAvatarUser); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({
          message: `${Object.values(err.errors).map((error) => error.message).join(', ')}`,
        });
      }
      return res.status(500).send({ message: 'Server Error' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatar,
};
