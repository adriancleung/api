import { Response, Request } from 'express';
import { AuthenticatedRequest, MailRequest } from '../types/request';

const addMail = (req: Request, res: Response) => {};

const deleteMail = (
  req: AuthenticatedRequest & MailRequest,
  res: Response
) => {};

const getAllMails = (req: AuthenticatedRequest, res: Response) => {};

export { addMail, deleteMail, getAllMails };
