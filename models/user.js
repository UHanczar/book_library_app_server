import mongoose from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, unique: true },
  login: { type: String, unique: true },
  password: { type: String, unique: true },
  isAdmin: { type: Boolean },
  created: { type: Date, default: Date.now }
});

UserSchema.pre('save', function(next) {
  const user = this;

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePasswords = function (enteredPassword) {
  return bcrypt.compareSync(enteredPassword, this.password);
};

export default mongoose.model('User', UserSchema);
