import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const salt = 12;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      index: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.statics.hashPassword = password => bcrypt.hash(password, salt);

userSchema.methods.checkPassword = function checkPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('user', userSchema);
