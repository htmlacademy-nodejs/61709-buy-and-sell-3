'use strict';

const PUBLIC_DIR = `public`;

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
  CREATED: 201,
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500
};

const RouteProtectionType = {
  FULL: `full`,
  SEMI: `semi`
};

const OFFERS_BY_CATEGORY_LIMIT = 8;

module.exports = {
  PUBLIC_DIR,
  OFFERS_BY_CATEGORY_LIMIT,
  ExitCode,
  DefaultPort,
  HttpCode,
  RouteProtectionType
};
