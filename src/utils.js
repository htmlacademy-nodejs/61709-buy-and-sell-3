'use strict';
const fs = require(`fs`).promises;
const moment = require(`moment`);
const jwt = require(`jsonwebtoken`);
const {validationResult} = require(`express-validator`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    return [];
  }
};

const readContentJSON = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);

    if (!content.trim().length) {
      return [];
    }

    return JSON.parse(content);
  } catch (err) {
    return [];
  }
};

const printNumWithLead0 = (number) => number < 10 ? `0${number}` : number;

const makePriceWithSpaces = (price) => {
  let priceStr = price.toString();
  return priceStr.length > 4 ? priceStr.replace(/\B(?=(\d{3})+(?!\d))/g, ` `) : price;
};

const getMostDiscussedOffers = (offers) => {
  return offers.filter((offer) => offer.comments.length > 0)
                .sort((a, b) => b.comments.length - a.comments.length)
                .slice(0, 8);
};

const getTodayDate = () => moment.utc().format();

const errorFormatter = ({msg}) => ({msg});
const validate = (req) => validationResult(req).formatWith(errorFormatter).array();

const generateTokens = (tokenData) => {
  const accessToken = jwt.sign({id: tokenData}, process.env.JWT_ACCESS_SECRET);
  const refreshToken = jwt.sign({id: tokenData}, process.env.JWT_REFRESH_SECRET);

  return {
    accessToken,
    refreshToken
  };
};

module.exports = {
  getRandomInt,
  shuffle,
  readContent,
  readContentJSON,
  printNumWithLead0,
  makePriceWithSpaces,
  getMostDiscussedOffers,
  getTodayDate,
  validate,
  generateTokens
};
