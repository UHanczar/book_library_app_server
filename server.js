import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import config from './config/keys';
import userRoutes from './routes/user';
import bookCategoriesRoutes from './routes/bookCategory';
import bookListRoutes from './routes/bookList';
import bookItemRoutes from './routes/bookItem';

const app = express();

mongoose.connect(config.database, (err) => {
  if (err) {
    console.log(`Error: ${err}`);
  } else {
    console.log('Connected to the Database');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api', userRoutes);
app.use('/api', bookCategoriesRoutes);
app.use('/api', bookListRoutes);
app.use('/api', bookItemRoutes);

app.listen(config.port, () => console.log(`Server runs on port ${config.port}`));
