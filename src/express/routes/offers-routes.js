'use strict';

const {Router} = require(`express`);
const {check, validationResult} = require(`express-validator`);
const {fileUploader} = require(`../file-uploader`);
const {createAPI} = require(`../axios-api`);

const offersRouter = new Router();
const api = createAPI();

offersRouter.get(`/category/:id`, (req, res) => res.render(`category`));

offersRouter.get(`/add`, async (req, res, next) => {
  try {
    const categories = await api.get(`/categories`);
    return res.render(`new-ticket`, {categories});
  } catch (err) {
    next(err);
  }

  return next();
});

offersRouter.post(`/add`, fileUploader.single(`picture`), [
  check(`title`, `Введите название`).trim().notEmpty(),
  check(`description`, `Введите описание (Минимум 55 символов)`).trim().notEmpty().bail().isLength({min: 55}),
  check(`category`, `Выберите минимум одну категорию`).exists().bail().isArray({min: 1}),
  check(`sum`, `Введите цену`).trim().notEmpty(),
  check(`type`, `Выберите тип предложения`).notEmpty()
], async (req, res, next) => {
  try {
    const file = req.file;
    const errors = validationResult(req).errors;
    let formFieldsData = req.body;

    if (!file) {
      errors.push({
        msg: `Файл не выбран или неверный формат (только jpg/jpeg/png)`
      });
    } else {
      formFieldsData = {
        ...formFieldsData,
        picture: {
          background: `01`,
          image: file.filename,
          image2x: file.filename
        }
      };
    }

    if (Object.keys(errors).length) {
      const categories = await api.get(`/categories`);
      return res.render(`new-ticket`, {errors, categories, formFieldsData});
    }

    await api.post(`/offers`, formFieldsData);

    return res.redirect(`/my`);
  } catch (err) {
    next(err);
  }

  return next();
});

offersRouter.get(`/edit/:id`, async (req, res, next) => {
  try {
    const offerId = req.params.id;
    const offer = await api.get(`/offers/${offerId}`);
    const categories = await api.get(`/categories`);

    return res.render(`ticket-edit`, {offer, categories});
  } catch (err) {
    next(err);
  }

  return next();
});

offersRouter.get(`/:id`, (req, res) => res.render(`ticket`));

module.exports = offersRouter;
