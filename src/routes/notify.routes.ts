import express from 'express';
import { body } from 'express-validator';
import { AuthType } from '../types/auth';
import { Role } from '../types/role';
const router = express.Router();

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';
import { validate } from '../middlewares/validator.middleware';

import { addAndSendUserNotification } from '../controllers/notify.controllers';

router.post(
  '/notify',
  [
    authorization(AuthType.API),
    permit(Role.USER),
    validate([
      body('title').isString(),
      body('shortDescription').isString(),
      body('description').isString().optional(),
      body('label').isString().optional(),
    ]),
  ],
  addAndSendUserNotification
);

export default router;
