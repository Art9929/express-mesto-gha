const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate'); // для обработки ошибок
const routes = require('./routes/index');
const centrError = require('./middlewares/centrError'); // централизация ошибок
// const path = require('path');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4,
}).then(() => {
  // eslint-disable-next-line no-console
  console.log('connected to db');
});

const app = express();

// app.use(express.static(path.join(__dirname, 'public'))); // подключаем фронт

app.use(express.json()); // то, что позволит обрабатывать json при методе post
app.use(routes); // Подключаем роуты
// обработка ошибок celebrate
app.use(errors());
// Централизация ошибок
app.use(centrError);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on port ${PORT}`);
});
