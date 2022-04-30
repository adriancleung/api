import express from 'express';
import { AuthType } from '../types/auth';
import { Role } from '../types/role';
const router = express.Router({ mergeParams: true });

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';

import { getApiKey, refreshApiKey } from '../controllers/api.controllers';

router.post(
  '/',
  [authorization(AuthType.JWT), permit(Role.USER, Role.ADMIN)],
  refreshApiKey
);
router.get(
  '/',
  [authorization(AuthType.JWT), permit(Role.USER, Role.ADMIN)],
  getApiKey
);

export default router;
