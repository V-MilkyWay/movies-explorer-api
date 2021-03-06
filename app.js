require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const routerUser = require('./routes/users');
const routerMovies = require('./routes/movies');
const routerEnters = require('./routes/enters');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect('mongodb://localhost:27017/moviesdb');
// Слушаем 3000 порт
const { PORT = 3001 } = process.env;

const app = express();

// Настройки cors
app.use(cors({
  origin: [
    'https://diploma.nomoredomains.club',
    'http://diploma.nomoredomains.club',
    'https://api.diploma.nomoredomains.club',
    'http://api.diploma.nomoredomains.club',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://62.84.114.117',
    'https://62.84.114.117',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(routerEnters);

app.use(auth);
app.use(routerUser);
app.use(routerMovies);
app.use('*', (req, res, next) => {
  const err = new Error('Cтраница не найдена');
  err.statusCode = 404;

  next(err);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
