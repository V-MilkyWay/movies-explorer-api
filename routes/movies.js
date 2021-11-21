const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerMovies = require('express').Router();
// импортируем controllers
const {
  createMovie,
  findAllMovies,
  findByIdAndRemoveMovie,
} = require('../controllers/movies');

routerMovies.get('/movies', findAllMovies);

routerMovies.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(50),
    director: Joi.string().required().min(2).max(50),
    duration: Joi.number().required().min(2).max(800),
    year: Joi.string().required().min(2).max(50),
    description: Joi.string().required().min(2).max(9000),
    image: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    trailer: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    nameRU: Joi.string().required().min(2).max(200),
    nameEN: Joi.string().required().min(2).max(200),
    thumbnail: Joi.string().required().pattern(/^(http|https):\/\/[^ "]+\.[^ "]+$/),
    movieId: Joi.number().required(),
  }),
}), createMovie);

routerMovies.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
}), findByIdAndRemoveMovie);

// экспортируем router
module.exports = routerMovies;
