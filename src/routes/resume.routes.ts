import express from 'express';
import { query } from 'express-validator';
import multer from 'multer';
import { AuthType } from '../types/auth';
const router = express.Router();

import { getResume, updateResume } from '../controllers/resume.controllers';

import { authorization } from '../middlewares/auth.middlewares';
import { validate } from '../middlewares/validator.middleware';

router.get(
  '/',
  validate([query('download').equals('true').optional()]),
  getResume
);
router.post(
  '/',
  [authorization(AuthType.JWT, AuthType.API), multer().single('resume')],
  updateResume
);

export default router;
