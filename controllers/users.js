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
  const id = req.params.id ? req.params.id : req.user._id;

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

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      // Неработающие методы:
      // const userWithoutPassword = user;
      // delete userWithoutPassword.password;
      // delete userWithoutPassword['password'];
      // const prop = "password";
      // delete userWithoutPassword[prop];
      // const { password, ...newObject } = user;
      // Reflect.deleteProperty(user, 'password');
      const {_id, name, about, avatar, email, ...a} = user;
      res.status(created).send({ _id, name, about, avatar, email });
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
};

// update profile
const updateProfileUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user,
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
    req.user,
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
