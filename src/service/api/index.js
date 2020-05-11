'use strict';

const {Router} = require(`express`);
const {categoryRoutesInit} = require(`../api/category`);
const {offerRoutesInit} = require(`./offer`);
const {searchRoutesInit} = require(`../api/search`);

const {getMockData} = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  OfferService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();

  categoryRoutesInit(app, new CategoryService(mockData));
  searchRoutesInit(app, new SearchService(mockData));
  offerRoutesInit(app, new OfferService(mockData), new CommentService());
})();

module.exports = app;


