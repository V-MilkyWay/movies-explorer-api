const Movie = require('../models/movie');

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image, trailer, nameRU, nameEN, thumbnail, movieId } = req.body;

  Movie.create({ country, director, duration, year, owner: req.user, description, image, trailer, nameRU, nameEN, thumbnail, movieId })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // Логика обработки ошибки
        const errNew = new Error('Переданы некорректные данные при создании карточки');
        errNew.statusCode = 400;

        next(errNew);
      }
      next(err);
    });
};

module.exports.findAllMovies = (req, res, next) => {
  Movie.find({})
    .then((movie) => res.send({ data: movie }))
    .catch(next);
};

module.exports.findByIdAndRemoveMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        const err = new Error('Карточка с указанным _id не найден');
        err.statusCode = 404;

        next(err);
      }  else if (req.user._id !== movie.owner.toString()) {
        const errNew = new Error('Отказано в доступе');
        errNew.statusCode = 403;

        next(errNew);
      }else {
        movie.remove().then(() => res.send({ data: movie }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        // Логика обработки ошибки
        const errNew = new Error('Переданы некорректные данные');
        errNew.statusCode = 400;

        next(errNew);
      }
      next(err);
    });
};
