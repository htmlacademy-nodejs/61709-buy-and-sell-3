'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

const getMyRouter = (service) => {

  myRouter.get(`/`, async (req, res, next) => {
    try {
      const offers = await service.getAllOffers();
      return res.render(`my-tickets`, {offers});
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments`, async (req, res, next) => {
    try {
      const offers = await service.getAllOffers();
      return res.render(`comments`, {offers: offers.slice(0, 3)});
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
