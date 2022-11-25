import express from 'express';
import { body, param, query } from 'express-validator';
import { AuthType } from '../types/auth';
import { Role } from '../types/role';
const router = express.Router({ mergeParams: true });

import { authorization } from '../middlewares/auth.middlewares';
import { paginate } from '../middlewares/pagination.middlewares';
import { permit } from '../middlewares/permission.middlewares';
import {
  notificationExists,
  validate,
} from '../middlewares/validator.middleware';

import {
  addUserNotification,
  deleteMultipleUserNotifications,
  deleteUserNotification,
  editUserNotification,
  getUserNotification,
  getUserNotifications,
} from '../controllers/notification.controllers';

router.post(
  '/',
  [
    authorization(AuthType.API),
    permit(Role.USER, Role.ADMIN),
    validate([
      body('title').isString(),
      body('shortDescription').isString(),
      body('description').isString().optional(),
      body('label').isString().optional(),
    ]),
  ],
  addUserNotification
);
router.get(
  '/',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([query('size').isInt(), query('page').isInt()]),
    paginate,
  ],
  getUserNotifications
);
router.get(
  '/:notification_id',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([
      param('notification_id').isUUID().bail().custom(notificationExists),
    ]),
  ],
  getUserNotification
);
router.post(
  '/:notification_id',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([
      param('notification_id').isUUID().bail().custom(notificationExists),
      body('title').isString().optional(),
      body('shortDescription').isString().optional(),
      body('description').isString().optional(),
      body('label').isString().optional(),
    ]),
  ],
  editUserNotification
);
router.delete(
  '/:notification_id',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([
      param('notification_id').isUUID().bail().custom(notificationExists),
    ]),
  ],
  deleteUserNotification
);
router.delete(
  '/',
  [
    authorization(AuthType.JWT),
    permit(Role.USER, Role.ADMIN),
    validate([
      body('notifications').isArray(),
      body('notifications.*').isUUID(),
    ]),
  ],
  deleteMultipleUserNotifications
);

export default router;
