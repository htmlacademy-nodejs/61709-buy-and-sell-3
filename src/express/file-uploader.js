'use strict';

const path = require(`path`);
const multer = require(`multer`);

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, path.resolve(__dirname, `../express/public`, `img`));
  },
  filename: (req, file, cb) =>{
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if ([`image/png`, `image/jpg`, `image/jpeg`].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileUploader = multer({
  storage: storageConfig,
  fileFilter
});

module.exports = {fileUploader};
