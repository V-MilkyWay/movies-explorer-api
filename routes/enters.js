// отделяем signup и signin

const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerEnters = require('express').Router();
// импортируем controllers
const { createUser, login } = require('../controllers/users');

routerEnters.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

routerEnters.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

// экспортируем router
module.exports = routerEnters;
