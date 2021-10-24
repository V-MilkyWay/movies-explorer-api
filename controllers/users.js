const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      }).then(() => res.status(200).send({
        data: {
          name,
          email,
        },
      }))
        .catch((err) => {
          if (err.code === 11000) {
            const errNew = new Error('Пользователь уже зарегистрирован');
            errNew.statusCode = 409;

            next(errNew);
          }
          if (err.name === 'ValidationError') {
            // Логика обработки ошибки
            const errNew = new Error('Переданы некорректные данные при создании пользователя');
            errNew.statusCode = 400;

            next(errNew);
          }
          next(err);
        });
    });
};

module.exports.infoAboutUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным _id не найден');
        err.statusCode = 404;

        next(err);
      } else {
        res.send({ data: user });
      }
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.user._id,
    {
      name,
      email,
    },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    })
    .then((user) => {
      if (!user) {
        const err = new Error('Пользователь с указанным _id не найден');
        err.statusCode = 404;

        next(err);
      } else {
        res.send({
          data: user,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Логика обработки ошибки
        const errNew = new Error('Переданы некорректные данные при обновлении профиля');
        errNew.statusCode = 400;

        next(errNew);
      } else if (err.code === 11000) {
        const errNew = new Error('Такой Email уже зарегистрирован');
        errNew.statusCode = 409;

        next(errNew);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        const err = new Error('Неправильные почта или пароль');
        err.statusCode = 401;

        next(err);
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            const err = new Error('Неправильные почта или пароль');
            err.statusCode = 401;

            next(err);
          }

          return user;
        });
    })
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;

      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'super-strong-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'None',
        secure: false,
      })
        .status(200)
        .send({ token, message: 'Вход выполнен успешно!' });
    })
    .catch(next);
};
