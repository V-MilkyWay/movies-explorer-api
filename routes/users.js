const { celebrate, Joi } = require('celebrate');
// создадим express router
const routerUser = require('express').Router();
// импортируем controllers
const {
  updateProfile,
  infoAboutUser,
} = require('../controllers/users');


routerUser.get('/users/me', infoAboutUser);

routerUser.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
}), updateProfile);


// экспортируем router
module.exports = routerUser;
