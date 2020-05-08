'use strict';

const chalk = require(`chalk`);
const {Router} = require(`express`);
const offersRouter = new Router();
const {
  FilePath,
  HttpCode
} = require(`../../constants`);
const {readContentJSON} = require(`../../utils`);

offersRouter.get(`/`, async (req, res) => {
  try {
    const mocks = await readContentJSON(FilePath.MOCKS);
    res.status(HttpCode.SUCCESS).json(mocks);
  } catch (err) {
    console.log(chalk.red(err));
    res.status(HttpCode.INTERNAL_SERVER_ERROR)
    .json({
      error: true,
      status: HttpCode.INTERNAL_SERVER_ERROR,
      message: err.message
    });
  }
});

module.exports = offersRouter;
