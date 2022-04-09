import { Response } from 'express';
import { AuthenticatedRequest, UserRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

import { generateApiKey } from '../handlers/auth.handlers';

const getApiKey = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  res.status(ApiResponseCode.SUCCESS).send({ apiKey: req.user.apiKey });
};

const refreshApiKey = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  const apiKey = await generateApiKey();
  try {
    await req.user.update({ apiKey: apiKey });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

export { getApiKey, refreshApiKey };
