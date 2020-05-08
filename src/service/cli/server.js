'use strict';

const {apiServerInit} = require(`../api-server/api-server`);
const {DefaultPort} = require(`../../constants`);

module.exports = {
  name: `--server`,
  run(customPort) {
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE_SERVER;
    apiServerInit(port);
  }
};
