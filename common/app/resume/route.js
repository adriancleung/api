const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { pdfToPng } = require('pdf-to-png-converter');

const { checkAuthorization } = require('@auth');
const { getResume, updateResume } = require('@db/resume');
const { errorMsg } = require('@util/error');
const { AUTH_TYPES, SERVER_ERROR } = require('@constants');

router.post(
  '/',
  [checkAuthorization([AUTH_TYPES.JWT, AUTH_TYPES.API]), upload.any()],
  (req, res) => {
    updateResume(req.files[0].buffer.toString('base64'))
      .then(results => res.status(results.statusCode).send(results.body))
      .catch(err =>
        res
          .status(SERVER_ERROR)
          .send(errorMsg(SERVER_ERROR, 'Could not update resume', err))
      );
  }
);

router.get('/', (req, res) => {
  getResume()
    .then(results => {
      const binary = Buffer.from(results.body, 'base64');
      res.setHeader('Content-Length', Buffer.byteLength(binary));
      if (req.query.image === 'png') {
        res.setHeader('Content-Type', 'image/png');
        pdfToPng(binary, {
          disableFontFace: true,
          useSystemFonts: false,
          viewportScale: 2.0,
          outputFileMask: './',
          pages: [1],
        }).then(value => res.status(results.statusCode).send(value[0].content));
      } else {
        res.setHeader('Content-Type', 'application/pdf');
        if (req.query.download === 'true') {
          res.setHeader(
            'Content-Disposition',
            'attachment;filename="Resume_AdrianLeung.pdf"'
          );
        }
        res.status(results.statusCode).send(binary);
      }
    })
    .catch(err =>
      res
        .status(SERVER_ERROR)
        .send(errorMsg(SERVER_ERROR, 'Could not retrieve resume', err))
    );
});

module.exports = router;
