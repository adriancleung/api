import express from 'express';
import { body } from 'express-validator';
import { AuthType } from '../types/auth';
const router = express.Router();

import { login, register, verify } from '../controllers/auth.controllers';

import { authorization } from '../middlewares/auth.middlewares';
import { isValidUser, validate } from '../middlewares/validator.middleware';

router.post(
  '/login',
  validate([body('email').isEmail(), body('password').isString()]),
  login
);
router.post(
  '/register',
  validate([
    body('email').isEmail().bail().custom(isValidUser),
    body('password').isString(),
  ]),
  register
);
router.post('/verify', authorization(AuthType.JWT), verify);

export default router;
