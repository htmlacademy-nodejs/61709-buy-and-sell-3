'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryRouter = new Router();

const getCategoryRouter = (categoryService) => {

  categoryRouter.get(`/`, async (req, res) => {
    const categories = await categoryService.findAll();
    return res.status(HttpCode.SUCCESS).json(categories);
  });

  categoryRouter.get(`/offers`, async (req, res) => {
    const categories = await categoryService.findAllWithOffers();
    return res.status(HttpCode.SUCCESS).json(categories);
  });

  return categoryRouter;
};

module.exports = {getCategoryRouter};
