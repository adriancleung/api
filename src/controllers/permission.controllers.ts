import { Response } from 'express';
import { AuthenticatedRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const addPermission = (req: AuthenticatedRequest, res: Response) => {
  res.status(ApiResponseCode.SUCCESS).send({ message: 'OK' });
};

export { addPermission };
