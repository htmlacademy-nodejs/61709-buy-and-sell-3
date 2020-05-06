'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const offersRouter = new Router();
const {
  FilePath,
  HttpCode
} = require(`../../../constants`);

offersRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FilePath.MOCKS);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.status(HttpCode.INTERNAL_SERVER_ERROR).send(err);
  }
});

module.exports = offersRouter;
