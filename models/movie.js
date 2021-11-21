const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  director: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  duration: {
    type: Number,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  year: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
    minlength: 2,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: function validation(v) {
        return /^(http|https):\/\/[^ "]+\.[^ "]+$/.test(v);
      },
      message: () => 'Ссылка неверна',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: function validation(v) {
        return /^(http|https):\/\/[^ "]+\.[^ "]+$/.test(v);
      },
      message: () => 'Ссылка неверна',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: function validation(v) {
        return /^(http|https):\/\/[^ "]+\.[^ "]+$/.test(v);
      },
      message: () => 'Ссылка неверна',
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
});
module.exports = mongoose.model('movie', movieSchema);
