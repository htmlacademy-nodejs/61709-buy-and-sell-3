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

module.exports = {
  PUBLIC_DIR,
  ExitCode,
  DefaultPort
};
