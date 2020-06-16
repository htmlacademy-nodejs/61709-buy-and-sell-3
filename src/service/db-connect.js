'use strict';

const Sequelize = require(`sequelize`);
const {getLogger} = require(`./logger`);
const logger = getLogger();
require(`dotenv`).config();

const connectDB = async () => {
  const sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
        pool: {
          max: 5,
          min: 0,
          idle: 10000
        },
        logging: false
      }
  );

  try {
    logger.debug(`Connecting to DB...`);
    await sequelize.authenticate();
    logger.info(`Connection success!`);
  } catch (err) {
    logger.error(`Connection failed with error: ${err}`);
  }
};

module.exports = {connectDB};
