'use strict';

const {Router} = require(`express`);
const {fileUploader} = require(`../file-uploader`);

const upload = fileUploader.single(`avatar`);

const getMainRouter = (service) => {

  const mainRouter = new Router();

  mainRouter.get(`/`, async (req, res, next) => {
    try {
      const {offers, mostDiscussedOffers} = await service.getAllOffers();
      const categories = await service.getAllCategoriesWithOffers();

      return res.render(`main`, {
        offers,
        categories,
        mostDiscussedOffers
      });
    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });

  mainRouter.post(`/register`, upload, async (req, res, next) => {
    try {
      const file = req.file;
      let userFormData = {...req.body};
      const [firstname, lastname] = userFormData.credentials.split(` `);

      if (file) {
        userFormData = {
          ...userFormData,
          avatar: file.filename,
        };
      }

      userFormData = {
        ...userFormData,
        firstname,
        lastname
      };

      const userCreationResult = await service.createNewUser(userFormData);

      if (userCreationResult.validationError) {
        const {errors} = userCreationResult;
        return res.render(`sign-up`, {errors, userFormData});
      }

      return res.redirect(`/login`);
    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/login`, (req, res) => res.render(`login`));

  mainRouter.get(`/search`, async (req, res, next) => {
    try {
      const {query} = req.query;
      const searchResult = await service.searchOffers(query);
      const {offers} = await service.getAllOffers();

      return res.render(`search-result`, {
        offers: searchResult,
        newOffers: offers
      });
    } catch (err) {
      return next(err);
    }
  });

  return mainRouter;
};


module.exports = {getMainRouter};
