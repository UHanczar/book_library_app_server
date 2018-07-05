import { Router } from 'express';

import Book from '../models/book';
import checkJwt from '../middlewares/checkJWT';

const router = Router();

router.get('/book_item/:id', async (req, res, next) => {
  try {
    const book = await Book.findById({ _id: req.params.id })
                  .populate('currentReader');

    res.json({
      success: true,
      book
    });
  } catch (error) {
    res.json({
      success: false,
      erorrMessage: `Error fetching book: ${JSON.stringify(error)}`
    });
  }
});

router.post('/book_item/rate', checkJwt, async (req, res, next) => {
  try {
    const book = await Book.findById({ _id: req.body.bookId });

    if (book) {
      const existingVoice = book.ratingData.find(item => item.userId === req.body.userId);

      if (existingVoice) {
        res.json({
          success: false,
          message: 'You already rated this book.'
        });
      } else {
        book.ratingData.push({
          userId: req.body.userId,
          rating: req.body.rating
        });

        await book.save();

        res.json({
          success: true,
          ratingData: book.ratingData
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Something went wrong. There is no book with this id.'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      erorrMessage: `Error to rate the book: ${JSON.stringify(error)}`
    });
  }
});

export default router;
