import express from 'express';
import { body } from 'express-validator';
const router = express.Router();

import { login, register, verify } from '../controllers/auth.controllers';

import { isValidUser, validate } from '../middlewares/validator.middleware';

router.post(
  '/login',
  validate([body('email').isEmail(), body('password').isString()]),
  login
);
router.post(
  '/register',
  validate([body('email').custom(isValidUser), body('password').isString()]),
  register
);
router.post('/verify', verify);

export default router;
