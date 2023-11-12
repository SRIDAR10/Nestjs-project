import * as mongoose from 'mongoose';

export const MoviesSchema = new mongoose.Schema({
  plot: String,
  poster: String,
  title: String,
  released: Date,
  directors: Array,
  imdb: Object,
});
