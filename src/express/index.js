'use strict';

const express = require(`express`);
const offersRoutes = require(`./routes/offers-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

const {DefaultPort} = require(`../constants`);

const app = express();

app.use(`/`, mainRoutes);
app.use(`/my`, myRoutes);
app.use(`/offers`, offersRoutes);

app.listen(DefaultPort.FRONT_SERVER, () => {
  console.log(`Server is running on port: ${DefaultPort.FRONT_SERVER}`);
});
