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
          .status(ApiResponseCode.CLIENT_ERROR)
          .send({ message: 'Authorization invalid' });
        return;
      }

      const { validAuth, statusCode, message } = await validateAuthorization(
        type,
        authValue,
        req
      );

      if (validAuth) {
        next();
      } else {
        res.status(statusCode).send({ message });
      }
      return;
    }
    res
      .status(ApiResponseCode.UNAUTHORIZED)
      .send({ message: 'Requires authentication' });
  };
};

const validateAuthorization = async (
  authType: AuthType,
  authValue: string,
  req: AuthenticatedRequest
): Promise<{
  validAuth: Boolean;
  statusCode: ApiResponseCode;
  message: String;
}> => {
  switch (authType) {
    case AuthType.API:
      const user = await User.findOne({ where: { apiKey: authValue } });
      if (user === null) {
        return {
          validAuth: false,
          statusCode: ApiResponseCode.CLIENT_ERROR,
          message: 'Authorization invalid',
        };
      }
      [req.userId, req.email, req.role] = [user.id, user.email, user.role.type];
      return {
        validAuth: true,
        statusCode: ApiResponseCode.SUCCESS,
        message: 'Authorized',
      };

    case AuthType.JWT:
      try {
        const token = authValue.split(' ')[1];
        const user = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
        [req.userId, req.email, req.role] = [
          user.userId,
          user.email,
          user.role,
        ];
        return {
          validAuth: true,
          statusCode: ApiResponseCode.SUCCESS,
          message: 'Authorized',
        };
      } catch (err) {
        return {
          validAuth: false,
          statusCode: ApiResponseCode.UNAUTHORIZED,
          message: 'Invalid token',
        };
      }
  }
};

export { authorization };
