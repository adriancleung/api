import { NextFunction, Request, Response } from 'express';
import {
  validationResult,
  ValidationChain,
  CustomValidator,
} from 'express-validator';
import User from '../models/User';

const isValidUser = async (email: string): Promise<CustomValidator> => {
  const user = await User.findOne({ where: { email: email } });
  if (user) {
    return Promise.reject('E-mail already in use');
  }
};

const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

export { isValidUser, validate };
