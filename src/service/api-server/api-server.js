'use strict';

const express = require(`express`);
const {getLogger} = require(`../logger`);
const logger = getLogger();
const pino = require(`express-pino-logger`)({logger});
const {
  HttpCode,
  API_PREFIX
} = require(`../service-constants`);
const {getMockData} = require(`../lib/get-mock-data`);

const {
  getCategoryRouter,
  getSearchRouter,
  getOffersRouter
} = require(`../api`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const getServer = async () => {
  const server = express();
  const mockData = await getMockData();

  server.disable(`x-powered-by`);
  server.use(express.json());
  server.use(pino);

  server.use((req, res, next) => {
    logger.debug(`Start request to url ${req.url}`);
    next();
  });

  server.use(
      `${API_PREFIX}/categories`,
      getCategoryRouter(new CategoryService(mockData))
  );
  server.use(
      `${API_PREFIX}/search`,
      getSearchRouter(new SearchService(mockData))
  );
  server.use(
      `${API_PREFIX}/offers`,
      getOffersRouter(
          new OfferService(mockData),
          new CommentService()
      )
  );

  server.use((req, res) => {
    const notFoundMessageText = `Not found`;

    logger.error(`End request with error ${HttpCode.NOT_FOUND}`);
    return res.status(HttpCode.NOT_FOUND)
    .json({
      error: true,
      status: HttpCode.NOT_FOUND,
      message: notFoundMessageText
    });
  });

  return server;
};

module.exports = {getServer};

