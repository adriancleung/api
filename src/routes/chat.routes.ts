import express from 'express';
import { body } from 'express-validator';
const router = express.Router();

import { getChatResponse } from '../controllers/chat.controller';

import { validate } from '../middlewares/validator.middleware';

router.post('/', validate([body('content').isString()]), getChatResponse);

export default router;
