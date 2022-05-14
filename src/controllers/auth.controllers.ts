import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

import { loginUser, registerUser } from '../handlers/auth.handlers';

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = await loginUser(email, password);
  res.status(response.statusCode).send(response.body);
};

const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const response = await registerUser(email, password);
  res.status(response.statusCode).send(response.body);
};

const verify = async (req: AuthenticatedRequest, res: Response) => {
  res.status(ApiResponseCode.SUCCESS).send({
    userId: req.userId,
    email: req.email,
    role: req.role,
    message: 'Authorized',
  });
};

export { login, register, verify };
