import express from 'express';
import { query } from 'express-validator';
import multer from 'multer';
import { AuthType } from '../types/auth';
import { RoleType } from '../types/role';
const router = express.Router();

import { getResume, updateResume } from '../controllers/resume.controllers';

import { authorization } from '../middlewares/auth.middlewares';
import { validate } from '../middlewares/validator.middleware';
import { permit } from '../middlewares/permission.middlewares';

router.get(
  '/',
  validate([
    query('download').equals('true').optional(),
    query('image').equals('png').optional(),
  ]),
  getResume
);
router.post(
  '/',
  [
    authorization(AuthType.JWT, AuthType.API),
    permit(RoleType.ADMIN),
    multer().single('resume'),
  ],
  updateResume
);

export default router;
