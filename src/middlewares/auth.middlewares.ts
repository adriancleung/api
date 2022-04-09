import { NextFunction, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthType, JwtPayload } from '../types/auth';
import { AuthenticatedRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const authorization = (...authType: AuthType[]): RequestHandler => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    for (const type of authType) {
      const authValue = req.headers[type];

      if (!authValue) {
        continue;
      }

      if (Array.isArray(authValue)) {
        res
          .send(ApiResponseCode.CLIENT_ERROR)
          .send({ message: 'Authorization invalid' });
        return;
      }

      if (await validateAuthorization(type, authValue, req, res)) {
        next();
        return;
      }
    }
    res
      .status(ApiResponseCode.UNAUTHORIZED)
      .send({ message: 'Requires authentication' });
  };
};

const validateAuthorization = async (
  authType: AuthType,
  authValue: string,
  req: AuthenticatedRequest,
  res: Response
): Promise<boolean> => {
  switch (authType) {
    case AuthType.API:
      const user = await User.findOne({ where: { apiKey: authValue } });
      if (user === null) {
        res
          .send(ApiResponseCode.CLIENT_ERROR)
          .send({ message: 'Authorization invalid' });
        return false;
      }
      [req.userId, req.email, req.role] = [user.id, user.email, user.role];
      return true;

    case AuthType.JWT:
      try {
        const user = jwt.verify(
          authValue,
          process.env.JWT_SECRET
        ) as JwtPayload;
        [req.userId, req.email, req.role] = [
          user.userId,
          user.email,
          user.role,
        ];
        return true;
      } catch (err) {
        res
          .status(ApiResponseCode.UNAUTHORIZED)
          .send({ message: 'Invalid token' });
        return false;
      }
  }
};

export { authorization };
