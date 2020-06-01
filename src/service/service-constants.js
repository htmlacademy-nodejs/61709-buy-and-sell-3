'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const DEFAULT_COUNT = 1;
const MAX_ID_LENGTH = 6;
const MAX_COMMENTS_COUNT = 4;
const API_PREFIX = `/api`;

const FilePath = {
  MOCKS: `mocks.json`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};

const OfferType = {
  BUY: `buy`,
  SALE: `sale`
};

const SumRestrict = {
  MIN: 1000,
  MAX: 100000
};

const PictureRestrict = {
  MIN: 1,
  MAX: 16
};

const GeneratorSlicer = {
  START: 0,
  END: 4
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  DEFAULT_COUNT,
  MAX_ID_LENGTH,
  MAX_COMMENTS_COUNT,
  API_PREFIX,
  FilePath,
  OfferType,
  SumRestrict,
  PictureRestrict,
  GeneratorSlicer
};
