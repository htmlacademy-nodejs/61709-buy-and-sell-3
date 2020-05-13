'use strict';

const path = require(`path`);
const chalk = require(`chalk`);
const express = require(`express`);
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const {
  DefaultPort,
  ExitCode,
  PUBLIC_DIR
} = require(`../constants`);

const app = express();

app.use(express.static(path.resolve(__dirname, PUBLIC_DIR)));

app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.use((req, res) => res.status(400).render(`errors/400`));
app.use((err, req, res) => res.status(500).render(`errors/500`));

app.listen(DefaultPort.FRONT_SERVER, (err) => {

  if (err) {
    console.error(chalk.red(`Ошибка при создании сервера`, err));
    process.exit(ExitCode.ERROR);
  }

  console.log(`Server is running on port: ${DefaultPort.FRONT_SERVER}`);
});
