import { Router } from 'express';
import jwt from 'jsonwebtoken';

import config from '../config/keys';
import User from '../models/user';
import checkJwt from '../middlewares/checkJWT';

const router = Router();

router.post('/login', async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ login: req.body.login });

    if (!existingUser) {
      res.json({
        success: false,
        message: 'Authentication failed. Account with that login is not exist.'
      });
    } else if (existingUser) {
      const validatedPassword = await existingUser.comparePasswords(req.body.password);
      if (!validatedPassword) {
        res.json({
          success: false,
          message: 'Authentication failed. Wrong password.'
        });
      } else {
        const token = jwt.sign({ user: existingUser }, config.secretKey, { expiresIn: '7d' });
        const user = {
          _id: existingUser._id,
          created: existingUser.created,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          login: existingUser.login,
          email: existingUser.email,
          isAdmin: existingUser.isAdmin
        };

        res.json({
          success: true,
          message: 'Enjoy your token.',
          token,
          user
        });
      }
    }
  } catch (error) {
    res.json({
      success: false,
      message: `${JSON.stringify(error)}`
    });
  }
});

router.get('/checkuser', checkJwt, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.decoded.user._id });

    if (!user) {
      res.json({
        success: false,
        message: 'There is some error in fenching data from database.'
      });
    } else {
      const userData = {
        _id: user._id,
        created: user.created,
        firstName: user.firstName,
        lastName: user.lastName,
        login: user.login,
        email: user.email,
        isAdmin: user.isAdmin
      };

      res.json({
        success: true,
        message: 'Sending user data',
        user: userData
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: `${JSON.stringify(error)}`
    });
  }
});

// only for adding new user, no api exist
router.post('/signup', async (req, res, next) => {
  try {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.login = req.body.login;
    user.password = req.body.password;
    user.email = req.body.email;
    user.isAdmin = req.body.isAdmin;

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      res.json({
        success: false,
        message: 'Account with that email is already exist.'
      });
    } else {
      user.save();

      const token = jwt.sign({ user }, config.secretKey, { expiresIn: '7d' });

      res.json({
        success: true,
        message: 'You signed up successfully. Enjoy your token',
        token
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: `${JSON.stringify(error)}`
    });
  }
});

export default router;
