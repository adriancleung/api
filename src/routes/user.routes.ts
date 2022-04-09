import express from 'express';
import { body, param } from 'express-validator';
import { AuthType } from '../types/auth';
import { Role } from '../types/role';
const router = express.Router();

import apis from './api.routes';
import notifications from './notification.routes';
import tokens from './token.routes';

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';
import { validate } from '../middlewares/validator.middleware';

import {
  deleteUserProfile,
  editUserProfile,
  getUserProfile,
} from '../controllers/user.controllers';

router.use('/:user_id/apis', validate([param('user_id').isUUID()]), apis);
router.use(
  '/:user_id/notifcations',
  validate([param('user_id').isUUID()]),
  notifications
);
router.use('/:user_id/tokens', validate([param('user_id').isUUID()]), tokens);

router.get('/:user_id', validate([param('user_id').isUUID()]), getUserProfile);
router.post(
  '/:user_id',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([param('user_id').isUUID(), body('email').isEmail()]),
  ],
  editUserProfile
);
router.delete(
  '/:user_id',
  [
    authorization(AuthType.JWT),
    permit(Role.ADMIN),
    validate([param('user_id').isUUID()]),
  ],
  deleteUserProfile
);

export default router;
