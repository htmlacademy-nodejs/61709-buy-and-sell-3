'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const categoryRouter = new Router();

const categoryRoutesInit = (app, categoryService) => {
  app.use(`/categories`, categoryRouter);

  categoryRouter.get(`/`, async (req, res) => {
    const categories = await categoryService.findAll();
    return res.status(HttpCode.SUCCESS).json(categories);
  });
};

module.exports = {categoryRoutesInit};
