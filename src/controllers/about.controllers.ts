import { Request, Response } from 'express';
import Data from '../models/Data';
import { ApiResponseCode } from '../types/response';

const getAbout = async (req: Request, res: Response) => {
  const about = await Data.findOne({ where: { key: 'about' } });
  if (about === null) {
    res.sendStatus(ApiResponseCode.RESOURCE_NOT_FOUND);
    return;
  }
  res.send(about.value);
};

const updateAbout = async (req: Request, res: Response) => {
  const { content } = req.body;
  try {
    await Data.upsert({
      key: 'about',
      value: content,
    });
  } catch (err) {
    console.error(err);
    res.status(ApiResponseCode.SERVER_ERROR).send({ error: err });
    return;
  }
  res.sendStatus(ApiResponseCode.SUCCESS);
};

export { getAbout, updateAbout };
