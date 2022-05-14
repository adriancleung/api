import { Response } from 'express';
import User from '../models/User';
import { AuthenticatedRequest, UserRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const deleteUserProfile = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  try {
    await req.user.destroy();
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const editUserProfile = async (
  req: AuthenticatedRequest & UserRequest,
  res: Response
) => {
  const { email } = req.body;
  try {
    await req.user.update({ email: email });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  const users = await User.unscoped().findAll();
  res.status(ApiResponseCode.SUCCESS).send(users);
};

const getUserProfile = async (req: UserRequest, res: Response) => {
  res.status(ApiResponseCode.SUCCESS).send(req.user);
};

export { deleteUserProfile, editUserProfile, getAllUsers, getUserProfile };
