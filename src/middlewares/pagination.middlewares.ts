import { NextFunction, Response } from 'express';
import { PaginationRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const paginate = (
  req: PaginationRequest,
  res: Response,
  next: NextFunction
) => {
  const size = parseInt(req.query.size.toString());
  if (isNaN(size) || size < 1) {
    res
      .status(ApiResponseCode.CLIENT_ERROR)
      .send({ message: 'size must be a positive integer' });
    return;
  }

  const page = parseInt(req.query.page.toString());
  if (isNaN(page) || page < 1) {
    res
      .status(ApiResponseCode.CLIENT_ERROR)
      .send({ message: 'page must be a positive integer' });
    return;
  }

  req.limit = size;
  req.offset = (page - 1) * req.limit;
  next();
};

export { paginate };
