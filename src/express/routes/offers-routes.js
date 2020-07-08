'use strict';

const {Router} = require(`express`);
const moment = require(`moment`);
const {validationResult} = require(`express-validator`);
const {
  newOfferFormFieldsRules,
  newCommentFormFieldsRules
} = require(`../form-validation`);
const {fileUploader} = require(`../file-uploader`);
const {getTodayDate} = require(`../../utils`);

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;

const upload = fileUploader.single(`picture`);

const getOffersRouter = (service) => {

  const offersRouter = new Router();

  offersRouter.get(`/category/:id`, async (req, res, next) => {
    try {
      const categoryId = req.params.id;
      const {offers, category} = await service.getOffersByCategoryId(categoryId);

      return res.render(`category`, {offers, category});
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

  offersRouter.post(`/add`, upload, ...newOfferFormFieldsRules, async (req, res, next) => {
    try {
      const errorFormatter = ({msg}) => ({msg});
      const errors = validationResult(req).formatWith(errorFormatter).array();
      const file = req.file;
      let formFieldsData = req.body;

      if (!file || file.size > MAX_FILE_SIZE) {
        errors.push({
          msg: `Файл не выбран, неверный формат (только jpg/jpeg/png),
          большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`
        });
      } else {
        formFieldsData = {
          ...formFieldsData,
          picture: file.filename,
          userId: 1,
          date: getTodayDate()
        };
      }

      if (Object.keys(errors).length) {
        const categories = await service.getAllCategories();
        return res.render(`new-offer`, {errors, categories, formFieldsData});
      }

      await service.createNewOffer(formFieldsData);

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

  offersRouter.post(`/edit/:id`, upload, ...newOfferFormFieldsRules, async (req, res, next) => {
    try {
      const errorFormatter = ({msg}) => ({msg});
      const errors = validationResult(req).formatWith(errorFormatter).array();
      const file = req.file;
      const offerId = req.params.id;
      let offer = req.body;

      if (!file || file.size > MAX_FILE_SIZE) {
        errors.push({
          msg: `Файл не выбран, неверный формат (только jpg/jpeg/png),
          большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`
        });
      } else {
        offer = {
          ...offer,
          picture: file.filename
        };
      }

      if (Object.keys(errors).length) {
        const categories = await service.getAllCategories();

        return res.render(`edit-offer`, {
          errors,
          categories,
          offer: {
            ...offer,
            id: offerId,
            categories: offer.categories ?
              categories.filter((category) => offer.categories.includes(String(category.id)))
              :
              []
          }
        });
      }

      await service.updateOffer(offerId, offer);

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

  offersRouter.post(`/:offerId/comments`, ...newCommentFormFieldsRules, async (req, res, next) => {
    try {
      let commentData = {...req.body};
      const {offerId} = req.params;
      const errorFormatter = ({msg}) => ({msg});
      const errors = validationResult(req).formatWith(errorFormatter).array();

      if (Object.keys(errors).length) {
        const offer = await service.getOfferById(offerId);
        return res.render(`offer`, {
          errors,
          offer,
          moment
        });
      }

      commentData = {
        ...commentData,
        offerId: Number(offerId),
        userId: 2,
        date: getTodayDate()
      };

      await service.createComment(commentData);

      return res.redirect(`/offers/${offerId}`);
    } catch (err) {
      return next(err);
    }
  });

  return offersRouter;
};

module.exports = {getOffersRouter};
