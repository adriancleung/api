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
import { userExists, validate } from '../middlewares/validator.middleware';

import {
  deleteUserProfile,
  editUserProfile,
  getAllUsers,
  getUserProfile,
} from '../controllers/user.controllers';

router.use(
  '/:user_id/apis',
  validate([param('user_id').isUUID().bail().custom(userExists)]),
  apis
);
router.use(
  '/:user_id/notifications',
  validate([param('user_id').isUUID().bail().custom(userExists)]),
  notifications
);
router.use(
  '/:user_id/tokens',
  validate([param('user_id').isUUID().bail().custom(userExists)]),
  tokens
);

router.get(
  '/:user_id',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([param('user_id').isUUID().bail().custom(userExists)]),
  ],
  getUserProfile
);
router.post(
  '/:user_id',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([
      param('user_id').isUUID().bail().custom(userExists),
      body('email').isEmail(),
    ]),
  ],
  editUserProfile
);
router.delete(
  '/:user_id',
  [
    authorization(AuthType.JWT),
    permit(Role.ADMIN),
    validate([param('user_id').isUUID().bail().custom(userExists)]),
  ],
  deleteUserProfile
);

router.get('/', [authorization(AuthType.JWT), permit(Role.ADMIN)], getAllUsers);

export default router;
