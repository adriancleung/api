import { Request, Response } from 'express';
import { pdfToPng } from 'pdf-to-png-converter';
import Data from '../models/Data';

const getResume = async (req: Request, res: Response) => {
  const resume = await Data.findOne({ where: { key: 'resume' } });
  if (resume === null) {
    res.sendStatus(404);
    return;
  }
  res.setHeader('Content-Length', Buffer.byteLength(resume.value));
  if (req.query.image === 'png') {
    res.setHeader('Content-Type', 'image/png');
    const image = await pdfToPng(resume.value, {
      disableFontFace: true,
      useSystemFonts: false,
      viewportScale: 2.0,
      outputFileMask: './',
      pages: [1],
    });
    res.send(image[0].content);
  } else {
    res.setHeader('Content-Type', 'application/pdf');
    if (req.query.download === 'true') {
      res.setHeader(
        'Content-Disposition',
        'attachment;filename="Resume_AdrianLeung.pdf'
      );
    }
    res.send(resume.value);
  }
};

const updateResume = async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(500).send({ error: 'Resume file was not provided' });
    return;
  }
  try {
    await Data.upsert({ key: 'resume', value: req.file.buffer });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
    return;
  }
  res.sendStatus(200);
};

export { getResume, updateResume };