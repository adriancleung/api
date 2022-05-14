import { Request, Response } from 'express';
import Data from '../models/Data';

const getAbout = async (req: Request, res: Response) => {
  const about = await Data.findOne({ where: { key: 'about' } });
  if (about === null) {
    res.sendStatus(404);
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
    res.status(500).send({ error: err });
    return;
  }
  res.sendStatus(200);
};

export { getAbout, updateAbout };
