import { Request, Response } from 'express';
import User from '../models/User';
import { AuthenticatedRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const deleteUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    await User.destroy({ where: { id: req.params.user_id } });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const editUserProfile = (req: AuthenticatedRequest, res: Response) => {
  const { email } = req.body;
  try {
    User.update({ email: email }, { where: { id: req.params.user_id } });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const getUserProfile = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.user_id);
  if (user === null) {
    res.sendStatus(ApiResponseCode.RESOURCE_NOT_FOUND);
    return;
  }
  res.status(ApiResponseCode.SUCCESS).send(user);
};

export { deleteUserProfile, editUserProfile, getUserProfile };
