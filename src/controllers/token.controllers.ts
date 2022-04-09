import { Response } from 'express';
import { col, fn } from 'sequelize';
import { AuthenticatedRequest, UserRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const addDeviceToken = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  const { token } = req.body;
  try {
    await req.user.update({ tokens: fn('array_append', col('tokens'), token) });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

export { addDeviceToken };
