'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../service-constants`);

const searchRouter = new Router();

const getSearchRouter = (searchService) => {

  searchRouter.get(`/`, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST)
      .json({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect data sent`
      });
    }

    const searchResults = searchService.findAll(query);

    return res.status(HttpCode.SUCCESS).json(searchResults);
  });

  return searchRouter;
};

module.exports = {getSearchRouter};
