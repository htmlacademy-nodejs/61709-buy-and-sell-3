'use strict';

const {Router} = require(`express`);
const {createAPI} = require(`../axios-api`);
const mainRouter = new Router();
const api = createAPI();

mainRouter.get(`/`, async (req, res, next) => {
  try {
    const offers = await api.get(`/offers`);
    const categories = await api.get(`/categories`);

    if (offers.length === 0) {
      return res.render(`main-empty`);
    }

    return res.render(`main`, {
      offers: offers.slice(0, 8),
      categories,
      mostDiscussedOffers: offers.filter((offer) => offer.comments.length > 0)
                          .sort((a, b) => b.comments.length - a.comments.length)
                          .slice(0, 8)
    });
  } catch (err) {
    next(err);
  }

  return next();
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));

mainRouter.get(`/search`, async (req, res, next) => {
  try {
    const {query} = req.query;
    const searchResult = await api.get(`/search?query=${encodeURI(query)}`);
    const offers = await api.get(`/offers`);

    return res.render(`search-result`, {
      offers: searchResult,
      mostDiscussedOffers: offers.filter((offer) => offer.comments.length > 0)
                          .sort((a, b) => b.comments.length - a.comments.length)
                          .slice(0, 8)
    });
  } catch (err) {
    next(err);
  }

  return next();
});

module.exports = mainRouter;
