import express from 'express';
import { body, param } from 'express-validator';
import { AuthType } from '../types/auth';
import { Role } from '../types/role';
const router = express.Router();

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';
import { mailExists, validate } from '../middlewares/validator.middleware';

import {
  addMail,
  deleteMail,
  getAllMails,
} from '../controllers/mail.controllers';

router.delete(
  '/:mail_id',
  [
    authorization(AuthType.JWT),
    permit(Role.ADMIN),
    validate([param('mail_id').isUUID().bail().custom(mailExists)]),
  ],
  deleteMail
);
router.get('/', [authorization(AuthType.JWT), permit(Role.ADMIN)], getAllMails);
router.post(
  '/',
  [
    validate([
      body('firstName').isString(),
      body('lastName').isString(),
      body('email').isEmail(),
      body('message').isString(),
    ]),
  ],
  addMail
);

export default router;
