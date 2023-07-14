const bcrypt = require('bcrypt');
const {
  ConflictError, // 409
  NotFound, // 404
  UnauthorizedError, // 401
  BadRequest, // 400

  // MODUL http2
  ok, // 200
  created, // 201
} = require('../errors/index');
const User = require('../models/user');
const { generateToken } = require('../util/jwt');

const SALT_ROUNDS = 10;

// Авторизация
const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw next(new BadRequest('Переданы некорректные данные!'));
  }

  return User.findOne({ email }).select('+password')
    .then((admin) => {
      if (!admin) {
        throw next(new UnauthorizedError('Пользователя с таким email не существует!'));
      }
      // Load hash from your password DB.
      return bcrypt.compare(password, admin.password, (err, isPasswordMatch) => {
        // result == true
        if (!isPasswordMatch) {
          throw next(new UnauthorizedError('Неправильный пароль!'));
        }
        // Создать и отдать токен
        const token = generateToken(admin._id);
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
  // req.params - это данные в урле
  const id = req.params.userId ? req.params.userId : req.user;

  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw next(new NotFound('Пользователь не найден'));
      }
      return res.status(ok).send(user);
    })
    .catch((err) => {
      /*
      CastError
      Эта ошибка возникает, если передан невалидный ID — идентификаторы
      в MongoDB имеют определенную структуру.
      Обычно эта ошибка возникает при любых манипуляциях,
      где используется ID — поиск, удаление и другие.
      */
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные!'));
      }
      return next(err);
    });
};

// // Регистрация | create user
const createUser = (req, res, next) => {
  // req.body - данные, которые ты отправляешь
  const {
    name, about, avatar, email, password,
  } = req.body;

  if (!email || !password) {
    throw next(new BadRequest('Переданы некорректные данные!'));
  }
  // Найти пользователя по email
  // Если пользователя нет, то создать
  // Если пользователь есть, то вернуть ошибку
  return bcrypt.hash(password, SALT_ROUNDS, (error, hash) => {
    // Store hash in your password DB.
    User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => { res.status(created).send(user); })
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
      /*
      ValidationError - Эта ошибка возникает,
      если данные не соответствуют схеме, которая описана для модели.
      ValidationError обычно возникает при создании объекта или его обновления.
      */
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
