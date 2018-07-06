import { Router } from 'express';

import BookCategory from '../models/bookCategory';

const router = Router();

router.get('/categories', async (req, res, next) => {
  try {
    const bookCategories = await BookCategory.find();

    res.json({
      success: true,
      bookCategories
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Error fetching book categories: ${JSON.stringify(error)}`
    });
  }
});


// For adding categories for database only, not have ui implementation
router.post('/category', async (req, res, next) => {
  try {
    const bookCategory = new BookCategory({
      categoryName: req.body.categoryName,
      categoryPathName: req.body.categoryPathName,
      created: Date.now()
    });

    await bookCategory.save();

    res.json({
      success: true,
      message: 'Successfully created new category.'
    });
  } catch (error) {
    console.log('Error', error);
  }
});

export default router;
