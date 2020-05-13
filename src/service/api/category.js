'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../service-constants`);

const categoryRouter = new Router();

const getCategoryRouter = (categoryService) => {

  categoryRouter.get(`/`, async (req, res) => {
    const categories = await categoryService.findAll();
    return res.status(HttpCode.SUCCESS).json(categories);
  });

  return categoryRouter;
};

module.exports = {getCategoryRouter};
