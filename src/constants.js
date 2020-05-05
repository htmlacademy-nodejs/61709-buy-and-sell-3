'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const PUBLIC_DIR = `public`;
const DEFAULT_COUNT = 1;

const DefaultPort = {
  FRONT_SERVER: 8080,
  SERVICE_SERVER: 3000
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0
};

const HttpCode = {
  SUCCESS: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401
};

const FilePath = {
  MOCKS: `mocks.json`,
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`
};

const OfferType = {
  OFFER: `offer`,
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
  PUBLIC_DIR,
  USER_ARGV_INDEX,
  DEFAULT_COUNT,
  ExitCode,
  FilePath,
  OfferType,
  SumRestrict,
  PictureRestrict,
  GeneratorSlicer,
  HttpCode,
  DefaultPort
};
