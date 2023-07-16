const bcrypt = require('bcrypt');
const {
  ConflictError, // 409
  NotFound, // 404
  UnauthorizedError, // 401
  BadRequest, // 400
  ok, // 200
  created, // 201
} = require('../errors/index');
const User = require('../models/user');
const { generateToken } = require('../util/jwt');

const SALT_ROUNDS = 10;

// Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Не верно введен email или пароль!');
      }
      return bcrypt.compare(password, user.password, (err, isPasswordMatch) => {
        if (!isPasswordMatch) {
          throw new UnauthorizedError('Неправильный пароль!');
        }
        // Создать и отдать токен
        const token = generateToken(user._id);
        res.cookie('auth', token);
        return res.status(ok).send({ token });
      });
    })
    .catch(next);
};

// all users
const getUsers = (req, res, next) => User.find({})
  .then((users) => res.status(ok).send(users))
  .catch(next);

// one user
const getUserById = (req, res, next) => {
  const id = req.params.id ? req.params.id : req.user.id;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFound('Пользователь не найден');
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      if (err === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

// Регистрация | create user
const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => {
        const userWithoutPassword = user.toJSON();
        delete userWithoutPassword.password;
        res.status(created).send(userWithoutPassword);
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return next(new BadRequest('Переданы некорректные данные при создании пользователя!'));
        }
        if (err.code === 11000) {
          return next(new ConflictError('Пользователь с таким email уже существует!'));
        }
        return next(err);
      });
  });
};

// update profile
const updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateProfile) => {
      res.status(ok).send(updateProfile);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

// update Avatar
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user.id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updateAvatarUser) => {
      res.status(ok).send(updateAvatarUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfileUser,
  updateAvatar,
  login,
};
