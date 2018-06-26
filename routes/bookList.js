import { Router } from 'express';

import Book from '../models/book';

const router = Router();

router.get('/booklist', async (req, res, next) => {
  try {
    const bookList = await Book.find();

    res.json({
      success: true,
      bookList
    });
  } catch (error) {
    res.json({
      success: false,
      erorrMessage: `Error fetching book list: ${JSON.stringify(error)}`
    });
  }
});


// For adding new book items for database only, not have ui implementation
router.post('/booklist', async (req, res, next) => {
  try {
    const bookItem = new Book({
      authors: req.body.authors,
      name: req.body.name,
      pathName: req.body.pathName,
      publisher: req.body.publisher,
      year: req.body.year,
      pages: req.body.pages,
      description: req.body.description,
      created: Date.now(),
      category: req.body.category,
      categoryKeys: req.body.categoryKeys
    });

    await bookItem.save();

    res.json({
      success: true,
      message: 'Sucessfully created new book item.'
    });
  } catch (error) {
    console.log('Error', error);
  }
});

export default router;
