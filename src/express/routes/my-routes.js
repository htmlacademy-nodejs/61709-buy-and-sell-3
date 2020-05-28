'use strict';

const {Router} = require(`express`);
const {createAPI} = require(`../axios-api`);

const myRouter = new Router();
const api = createAPI();

myRouter.get(`/`, async (req, res, next) => {
  try {
    const offers = await api.get(`/offers`);
    return res.render(`my-tickets`, {offers});
  } catch (err) {
    next(err);
  }

  return next();
});

myRouter.get(`/comments`, async (req, res, next) => {
  try {
    const offers = await api.get(`/offers`);
    return res.render(`comments`, {offers: offers.slice(0, 3)});
  } catch (err) {
    next(err);
  }

  return next();
});

module.exports = myRouter;
