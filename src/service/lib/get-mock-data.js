'use strict';

const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {FilePath} = require(`../service-constants`);
const {readContentJSON} = require(`../../utils`);

const getMockData = async () => {

  let fileData = null;

  try {
    fileData = await readContentJSON(FilePath.MOCKS);
  } catch (err) {
    console.log(chalk.red(err));
    process.exit(ExitCode.ERROR);
  }

  return fileData;
};

module.exports = {getMockData};
