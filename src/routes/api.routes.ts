import express from 'express';
import { AuthType } from '../types/auth';
import { RoleType } from '../types/role';
const router = express.Router({ mergeParams: true });

import { authorization } from '../middlewares/auth.middlewares';
import { permit } from '../middlewares/permission.middlewares';

import { getApiKey, refreshApiKey } from '../controllers/api.controllers';

router.post(
  '/',
  [authorization(AuthType.JWT), permit(RoleType.USER, RoleType.ADMIN)],
  refreshApiKey
);
router.get(
  '/',
  [authorization(AuthType.JWT), permit(RoleType.USER, RoleType.ADMIN)],
  getApiKey
);

export default router;
