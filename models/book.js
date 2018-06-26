import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookItemSchema = new Schema({
  authors: { type: Array },
  name: { type: String, unique: true },
  pathName: { type: String, unique: true, lowercase: true },
  publisher: { type: String },
  year: { type: String },
  pages: { type: String },
  description: { type: String },
  created: { type: Date, default: Date.now }
});

export default mongoose.model('BookItem', BookItemSchema);
