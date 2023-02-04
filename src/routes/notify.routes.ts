import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { AuthType } from '../types/auth';
import { ApiResponseCode } from '../types/response';
import { RoleType } from '../types/role';
const router = express.Router();

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';
import { validate } from '../middlewares/validator.middleware';

import { addAndSendUserNotification } from '../controllers/notify.controllers';

router.post(
  '/notify',
  [
    authorization(AuthType.API),
    permit(RoleType.USER),
    validate([
      body('title').isString(),
      body('shortDescription').isString(),
      body('description').isString().optional(),
      body('label').isString().optional(),
    ]),
  ],
  addAndSendUserNotification
);

router.post('/pushie/notify', (req: Request, res: Response) => {
  res
    .status(ApiResponseCode.GONE)
    .send({ message: 'This endpoint has been moved to /notify.' });
});

export default router;
