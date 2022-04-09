import { NextFunction, RequestHandler, Response } from 'express';
import { AuthenticatedRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';
import { Role } from '../types/role';

const permit = (...roles: Role[]): RequestHandler => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      res
        .status(ApiResponseCode.UNAUTHORIZED)
        .send({ message: 'Requires authorization' });
      return;
    }
    if (
      !req.role ||
      (req.role && !roles.includes(req.role)) ||
      (req.role === Role.USER && req.params.user_id !== req.userId.toString())
    ) {
      res.status(ApiResponseCode.FORBIDDEN).send({
        message: 'You do not have permission to access this resource',
      });
      return;
    }
    next();
  };
};

export { permit };
