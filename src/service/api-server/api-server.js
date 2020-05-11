'use strict';

const express = require(`express`);
const chalk = require(`chalk`);

const {
  HttpCode,
  ExitCode,
  API_PREFIX
} = require(`../../constants`);

const apiRoutes = require(`../api`);
const app = express();

app.use(express.json());
app.use(API_PREFIX, apiRoutes);

app.use((req, res) => {
  const notFoundMessageText = `Not found`;
  res.status(HttpCode.NOT_FOUND)
  .json({
    error: true,
    status: HttpCode.NOT_FOUND,
    message: notFoundMessageText
  });
});

const apiServerInit = (port) => {
  app.listen(port, (err) => {
    if (err) {
      console.error(chalk.red(`Ошибка при создании сервера`, err));
      process.exit(ExitCode.ERROR);
    }

    return console.info(chalk.green(`Ожидаю соединений на порту: ${port}`));
  });
};

module.exports = {
  apiServerInit
};

