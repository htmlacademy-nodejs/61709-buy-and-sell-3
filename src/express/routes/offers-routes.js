'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const moment = require(`moment`);
const {fileUploader} = require(`../file-uploader`);
const checkAuth = require(`../check-auth`);
const {RouteProtectionType} = require(`../../constants`);

const csrfProtection = csrf({cookie: true});
const upload = fileUploader.single(`picture`);

const getOffersRouter = (service) => {

  const offersRouter = new Router();

  offersRouter.get(`/category/:id`, async (req, res, next) => {
    try {
      const activePage = parseInt(req.query.page, 10) || 1;
      const categoryId = req.params.id;
      const categories = await service.getAllCategoriesWithOffers();
      const {
        offers,
        category,
        offersCount,
        pagesCount
      } = await service.getOffersByCategoryId(categoryId, activePage);

      return res.render(`category`, {
        offers,
        categories,
        category,
        offersCount,
        activePage,
        pagesCount
      });
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/add`, csrfProtection, checkAuth(service, RouteProtectionType.FULL), async (req, res, next) => {
    try {
      const categories = await service.getAllCategories();
      return res.render(`new-offer`, {categories, csrf: req.csrfToken()});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/add`, checkAuth(service, RouteProtectionType.FULL), upload, csrfProtection, async (req, res, next) => {
    try {
      const file = req.file;
      const user = req.user;
      let offerData = {...req.body};

      if (file) {
        offerData = {
          ...offerData,
          userId: user.id,
          picture: file.filename,
        };
      }

      const offerCreationResult = await service.createNewOffer(offerData);

      if (offerCreationResult.validationError) {
        const {errors, categories} = offerCreationResult;
        return res.render(`new-offer`, {errors, categories, offerData, csrf: req.csrfToken()});
      }

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/edit/:id`, csrfProtection, checkAuth(service, RouteProtectionType.FULL), async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const offer = await service.getOfferById(offerId);
      const categories = await service.getAllCategories();

      return res.render(`edit-offer`, {offer, categories, csrf: req.csrfToken()});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/edit/:id`, checkAuth(service, RouteProtectionType.FULL), upload, csrfProtection, async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const file = req.file;
      let offerData = {...req.body};

      if (file) {
        offerData = {
          ...offerData,
          picture: file.filename,
        };
      }

      const offerUpdateResult = await service.updateOffer(offerId, offerData);

      if (offerUpdateResult.validationError) {
        const {errors, categories} = offerUpdateResult;

        return res.render(`edit-offer`, {
          errors,
          categories,
          offerData: {
            ...offerData,
            categories: offerData.categories ? offerData.categories : []
          },
          offerId,
          csrf: req.csrfToken()
        });
      }

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/:id`, csrfProtection, async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const offer = await service.getOfferById(offerId);
      return res.render(`offer`, {offer, moment, csrf: req.csrfToken()});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/:offerId`, csrfProtection, checkAuth(service, RouteProtectionType.FULL), async (req, res, next) => {
    try {
      let commentData = {...req.body};
      const user = req.user;
      const {offerId} = req.params;

      commentData = {...commentData, userId: user.id};

      const commentCreationResult = await service.createComment(commentData, offerId);

      if (commentCreationResult.validationError) {
        const {errors, offer} = commentCreationResult;
        return res.render(`offer`, {errors, offer, csrf: req.csrfToken()});
      }

      return res.redirect(`/offers/${offerId}`);
    } catch (err) {
      return next(err);
    }
  });

  return offersRouter;
};

module.exports = {getOffersRouter};
