'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const searchRouter = new Router();

const searchRoutesInit = (app, searchService) => {
  app.use(`/search`, searchRouter);

  searchRouter.get(`/`, (req, res) => {
    const {query} = req.query;

    if (!query) {
      return res.status(HttpCode.BAD_REQUEST)
      .json({
        error: true,
        status: HttpCode.BAD_REQUEST,
        message: `Incorrect data send`
      });
    }

    const searchResults = searchService.findAll(query);
    const searchStatus = searchResults.length > 0 ? HttpCode.SUCCESS : HttpCode.NOT_FOUND;

    return res.status(searchStatus).json(searchResults);
  });
};

module.exports = {searchRoutesInit};
