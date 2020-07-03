'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const searchRouter = new Router();

const getSearchRouter = (searchService) => {

  searchRouter.get(`/`, async (req, res) => {
    const {query} = req.query;

    if (typeof (query) === `undefined`) {
      return res.status(HttpCode.BAD_REQUEST)
      .json({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect data sent`
      });
    }

    const searchResults = await searchService.findAll(query);

    return res.status(HttpCode.SUCCESS).json(searchResults);
  });

  return searchRouter;
};

module.exports = {getSearchRouter};
