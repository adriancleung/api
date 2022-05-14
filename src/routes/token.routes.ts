import express from 'express';
import { body } from 'express-validator';
import { AuthType } from '../types/auth';
import { Role } from '../types/role';
const router = express.Router({ mergeParams: true });

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';
import { validate } from '../middlewares/validator.middleware';

import { addDeviceToken } from '../controllers/token.controllers';

router.post(
  '/',
  [
    authorization(AuthType.JWT),
    permit(Role.USER),
    validate([body('token').isString()]),
  ],
  addDeviceToken
);

export default router;
