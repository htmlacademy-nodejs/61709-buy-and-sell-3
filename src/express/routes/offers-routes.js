'use strict';

const {Router} = require(`express`);
const moment = require(`moment`);
const {fileUploader} = require(`../file-uploader`);

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

  offersRouter.get(`/add`, async (req, res, next) => {
    try {
      const categories = await service.getAllCategories();
      return res.render(`new-offer`, {categories});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/add`, upload, async (req, res, next) => {
    try {
      const file = req.file;
      let offerData = {...req.body};

      if (file) {
        offerData = {
          ...offerData,
          picture: file.filename,
        };
      }

      const newOfferData = await service.createNewOffer(offerData);

      if (newOfferData.validationError) {
        const {errors, categories, offerFormData} = newOfferData;
        return res.render(`new-offer`, {errors, categories, offerFormData});
      }

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/edit/:id`, async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const offer = await service.getOfferById(offerId);
      const categories = await service.getAllCategories();

      return res.render(`edit-offer`, {offer, categories});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/edit/:id`, upload, async (req, res, next) => {
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

      const editedOfferData = await service.updateOffer(offerId, offerData);

      if (editedOfferData.validationError) {
        const {errors, categories, offerFormData} = editedOfferData;

        return res.render(`edit-offer`, {
          errors,
          categories,
          offerFormData: {
            ...offerFormData,
            categories: offerFormData.categories ? offerFormData.categories : []
          },
          offerId
        });
      }

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.get(`/:id`, async (req, res, next) => {
    try {
      const offerId = req.params.id;
      const offer = await service.getOfferById(offerId);
      return res.render(`offer`, {offer, moment});
    } catch (err) {
      return next(err);
    }
  });

  offersRouter.post(`/:offerId`, async (req, res, next) => {
    try {
      let commentData = {...req.body};
      const {offerId} = req.params;

      const newComment = await service.createComment(commentData, offerId);

      if (newComment.validationError) {
        const {errors, offer} = newComment;
        return res.render(`offer`, {errors, offer});
      }

      return res.redirect(`/offers/${offerId}`);
    } catch (err) {
      return next(err);
    }
  });

  return offersRouter;
};

module.exports = {getOffersRouter};
