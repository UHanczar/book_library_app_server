import { Router } from 'express';

import Book from '../models/book';

const router = Router();

router.get('/book_item/:id', async (req, res, next) => {
  try {
    const book = await Book.findOne({ _id: req.params.id });

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

export default router;
