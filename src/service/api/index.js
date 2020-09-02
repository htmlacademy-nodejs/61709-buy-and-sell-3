'use strict';

const {getCategoryRouter} = require(`./category`);
const {getOffersRouter} = require(`./offer`);
const {getSearchRouter} = require(`./search`);
const {getUserRouter} = require(`./user`);

module.exports = {
  getCategoryRouter,
  getOffersRouter,
  getSearchRouter,
  getUserRouter
};


