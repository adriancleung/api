import { Response, Request } from 'express';
import Mail from '../models/Mail';
import { AuthenticatedRequest, MailRequest } from '../types/request';
import { ApiResponseCode } from '../types/response';

const addMail = async (req: Request, res: Response) => {
  const { firstName, lastName, email, message } = req.body;
  try {
    Mail.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      message: message,
    });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const deleteMail = async (
  req: AuthenticatedRequest & MailRequest,
  res: Response
) => {
  try {
    await req.mail.destroy();
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ message: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

const getAllMails = async (req: AuthenticatedRequest, res: Response) => {
  const mails = await Mail.findAll();
  res.status(ApiResponseCode.SUCCESS).send({ mails: mails });
};

export { addMail, deleteMail, getAllMails };
