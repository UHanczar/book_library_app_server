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
  category: { type: Array },
  categoryKeys: { type: Array },
  created: { type: Date, default: Date.now },
  rating: { type: String, default: '0' },
  isAvailable: { type: Boolean, default: true },
  currentReader: { type: String, default: null },
  returnDate: { type: Date, default: null }
});

export default mongoose.model('BookItem', BookItemSchema);
