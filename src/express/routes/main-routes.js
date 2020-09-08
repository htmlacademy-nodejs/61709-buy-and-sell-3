'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const {fileUploader} = require(`../file-uploader`);
const checkAuth = require(`../check-auth`);
const {RouteProtectionType} = require(`../../constants`);

const csrfProtection = csrf({cookie: true});
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

  mainRouter.get(`/register`, csrfProtection, checkAuth(service, RouteProtectionType.SEMI), (req, res) => {
    return res.render(`sign-up`, {csrf: req.csrfToken()});
  });

  mainRouter.post(`/register`, checkAuth(service, RouteProtectionType.SEMI), upload, csrfProtection, async (req, res, next) => {
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
        return res.render(`sign-up`, {errors, userFormData, csrf: req.csrfToken()});
      }

      return res.redirect(`/login`);
    } catch (err) {
      return next(err);
    }
  });

  mainRouter.get(`/login`, csrfProtection, checkAuth(service, RouteProtectionType.SEMI), (req, res) => {
    return res.render(`login`, {csrf: req.csrfToken()});
  });

  mainRouter.post(`/login`, csrfProtection, checkAuth(service, RouteProtectionType.SEMI), async (req, res, next) => {
    try {
      let userData = {...req.body};
      const userLoginResult = await service.logUser(userData);

      if (userLoginResult.validationError) {
        const {errors} = userLoginResult;
        return res.render(`login`, {errors, userData, csrf: req.csrfToken()});
      }

      const {accessToken, refreshToken, user} = userLoginResult;
      res.cookie(`auth_token`, accessToken);
      res.cookie(`refresh_token`, refreshToken);
      req.app.locals.user = user;
      return res.redirect(`/`);
    } catch (err) {
      return next(err);
    }

  });

  mainRouter.get(`/logout`, async (req, res) => {
    req.app.locals.user = null;
    res.clearCookie(`auth_token`);
    return res.redirect(`/login`);
  });

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
