import { Router } from 'express';

import Book from '../models/book';
import User from '../models/user';
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
      message: `Error fetching book: ${JSON.stringify(error)}`
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
      message: `Error to rate the book: ${JSON.stringify(error)}`
    });
  }
});

router.post('/book_item/assign', checkJwt, async (req, res, next) => {
  try {
    if (req.decoded.user.isAdmin && req.body.bookId && req.body.userId) {
      const book = await Book.findById({ _id: req.body.bookId });

      if (book && book.isAvailable) {

        book.isAvailable = false;
        book.currentReader = req.body.userId;
        book.returnDate = (Date.now() + (1000 * 60 * 60 * 24 * 14));
        await book.save();

        const updatedBook = await Book.findById({ _id: req.body.bookId })
          .populate('currentReader');

        res.json({
          success: true,
          book: updatedBook
        });
      } else {
        res.json({
          success: false,
          message: 'Something went wrong. There is no book with this id.'
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Only admin can assign books.'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: `Error to assign the book: ${JSON.stringify(error)}`
    });
  }
});

router.post('/book_item/unassign', checkJwt, async (req, res, next) => {
  try {
    if (req.decoded.user.isAdmin && req.body.bookId) {
      const book = await Book.findById({ _id: req.body.bookId });

      if (book && !book.isAvailable) {
        book.isAvailable = true;
        book.currentReader = null;
        book.returnDate = null;

        await book.save();

        res.json({
          success: true,
          book
        });
      } else {
        res.json({
          success: false,
          message: 'Something went wrong. There is no book with this id.'
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Only admin can assign books.'
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: `Error to assign the book: ${JSON.stringify(error)}`
    });
  }
});

export default router;
