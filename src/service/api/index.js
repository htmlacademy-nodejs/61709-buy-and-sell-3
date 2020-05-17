'use strict';

const {getCategoryRouter} = require(`./category`);
const {getOffersRouter} = require(`./offer`);
const {getSearchRouter} = require(`./search`);

module.exports = {
  getCategoryRouter,
  getOffersRouter,
  getSearchRouter
};


