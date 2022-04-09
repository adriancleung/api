import { Request, Response } from 'express';

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

const verify = (req: Request, res: Response) => {
  res.sendStatus(200);
};

export { login, register, verify };
