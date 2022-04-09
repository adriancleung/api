import express from 'express';
import { body } from 'express-validator';
import { AuthType } from '../types/auth';
const router = express.Router();

import { getAbout, updateAbout } from '../controllers/about.controllers';

import { authorization } from '../middlewares/auth.middlewares';
import { validate } from '../middlewares/validator.middleware';

router.get('/', getAbout);
router.post(
  '/',
  [
    authorization([AuthType.JWT, AuthType.API]),
    validate([body('content').isString()]),
  ],
  updateAbout
);

export default router;
