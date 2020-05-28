'use strict';

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const {
  HttpCode,
  DefaultPort,
  ExitCode,
  PUBLIC_DIR
} = require(`../constants`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));
app.use(express.urlencoded({extended: false}));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use((req, res) => res.status(404).render(`errors/404`));
app.use((err, req, res, next) => {

  if (err) {
    console.error(chalk.red(err));
    return res.status(HttpCode.INTERNAL_SERVER_ERROR).render(`errors/500`);
  }

  return next();
});

app.listen(DefaultPort.FRONT_SERVER, (err) => {

  if (err) {
    console.error(chalk.red(`Ошибка при создании сервера`, err));
    process.exit(ExitCode.ERROR);
  }

  console.log(`Server is running on port: ${DefaultPort.FRONT_SERVER}`);
});
