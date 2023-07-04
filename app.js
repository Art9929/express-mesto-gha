const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/index');
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

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log(`Server start on port ${PORT}`);
});
