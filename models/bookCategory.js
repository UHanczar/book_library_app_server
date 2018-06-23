import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookCategorySchema = new Schema({
  categoryName: { type: String, unique: true },
  categoryPathName: { type: String, unique: true, lowercase: true },
  created: { type: Date, default: Date.now }
});

export default mongoose.model('Category', BookCategorySchema);
