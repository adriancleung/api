import express from 'express';
import { body } from 'express-validator';
const router = express.Router();

import { isValidRoute, validate } from '../middlewares/validator.middleware';

import { addPermission } from '../controllers/permission.controllers';
import { RequestMethod } from '../types/request';

router.post('/', [
  validate([
    body('route').isString().bail().custom(isValidRoute),
    body('method').isIn(Object.values(RequestMethod)),
  ]),
  addPermission,
]);

export default router;
