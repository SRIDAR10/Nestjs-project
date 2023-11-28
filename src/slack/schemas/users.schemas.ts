import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  token: String,
  userId: String,
});
