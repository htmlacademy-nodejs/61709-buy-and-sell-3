'use strict';

const {Router} = require(`express`);
const {getCategoryRouter} = require(`../api/category`);
const {getOffersRouter} = require(`./offer`);
const {getSearchRouter} = require(`../api/search`);

const {getMockData} = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const appRouter = new Router();

(async () => {
  const mockData = await getMockData();
  appRouter.use(
      `/categories`,
      getCategoryRouter(new CategoryService(mockData))
  );
  appRouter.use(
      `/search`,
      getSearchRouter(new SearchService(mockData))
  );
  appRouter.use(
      `/offers`,
      getOffersRouter(
          new OfferService(mockData),
          new CommentService()
      )
  );
})();

module.exports = appRouter;


