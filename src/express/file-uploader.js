'use strict';

const multer = require(`multer`);

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, `./src/express/public/img`);
  },
  filename: (req, file, cb) =>{
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === `image/png` || file.mimetype === `image/jpg` || file.mimetype === `image/jpeg`) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const fileUploader = multer({storage: storageConfig, fileFilter});

module.exports = {fileUploader};
