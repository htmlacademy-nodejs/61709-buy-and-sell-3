'use strict';

const {getServer} = require(`../api-server`);
const {getLogger} = require(`../logger`);

const {
  DefaultPort,
  ExitCode
} = require(`../../constants`);

module.exports = {
  name: `--server`,
  async run(customPort) {
    const port = Number.parseInt(customPort, 10) || DefaultPort.SERVICE_SERVER;
    const server = await getServer();
    const logger = getLogger();

    server.listen(port, (err) => {
      if (err) {
        logger.error(`Server error`, err);
        process.exit(ExitCode.ERROR);
      }

      logger.info(`Server is running on port: ${port}`);
    });
  }
};
