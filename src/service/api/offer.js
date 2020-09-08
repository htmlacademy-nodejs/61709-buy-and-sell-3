'use strict';

const {Router} = require(`express`);
const {
  newOfferFormFieldsRules,
  newCommentFormFieldsRules
} = require(`../form-validation`);
const {checkParamIsInteger} = require(`../middlewares/param-validator`);
const {
  HttpCode,
  OFFERS_BY_CATEGORY_LIMIT
} = require(`../../constants`);
const {
  getTodayDate,
  validate
} = require(`../../utils`);

const offersRouter = new Router();

const getOffersRouter = (offerService, commentService, categoryService) => {

  offersRouter.get(`/`, async (req, res) => {
    const offers = await offerService.findAll();
    const mostDiscussedOffers = await offerService.findMostDiscussedOffers();
    return res.status(HttpCode.SUCCESS).json({offers, mostDiscussedOffers});
  });

  offersRouter.get(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;
    const offer = await offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with id: ${offerId} is not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json(offer);
  });

  offersRouter.get(`/user/:userId`, async (req, res) => {
    const {userId} = req.params;
    const userOffers = await offerService.findByUserId(userId);

    return res.status(HttpCode.SUCCESS).json(userOffers);
  });

  offersRouter.get(`/:userId/comments`, async (req, res) => {
    const {userId} = req.params;
    const offers = await offerService.findLastOfferComments(userId);

    return res.status(HttpCode.SUCCESS).json(offers);
  });

  offersRouter.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {activePage} = req.query;
    const isCategoryExist = await categoryService.getCategoryById(categoryId);

    if (!isCategoryExist) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Category with id: ${categoryId} is not found`
        });
    }

    const {
      category,
      offers,
      offersCount
    } = await offerService.findOffersByCategoryId(categoryId, Number(activePage));
    const pagesCount = Math.ceil(offersCount / OFFERS_BY_CATEGORY_LIMIT);

    if (activePage > pagesCount) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Page ${activePage} not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json({
      category,
      offers,
      offersCount,
      pagesCount
    });
  });

  offersRouter.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;

    const offer = await offerService.deleteOffer(offerId);

    return res.status(HttpCode.CREATED).json(offer);
  });

  offersRouter.post(`/`, ...newOfferFormFieldsRules, async (req, res) => {
    const errors = validate(req);
    let offerFormData = {...req.body};

    if (Object.keys(errors).length) {
      const categories = await categoryService.findAll();
      return res.status(HttpCode.BAD_REQUEST).send({errors, categories, offerFormData});
    }

    offerFormData = {
      ...offerFormData,
      date: getTodayDate()
    };

    const offer = await offerService.createOffer(offerFormData);

    return res.status(HttpCode.CREATED).json(offer);
  });

  offersRouter.put(`/:offerId`, checkParamIsInteger, ...newOfferFormFieldsRules, async (req, res) => {
    const {offerId} = req.params;
    const errors = validate(req);
    const offer = await offerService.findOne(offerId);
    let offerFormData = {...req.body};

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with id: ${offerId} is not found`
        });
    }

    if (Object.keys(errors).length) {
      const categories = await categoryService.findAll();
      return res.status(HttpCode.BAD_REQUEST).send({errors, categories, offerFormData, offer});
    }

    const updatedOffer = await offerService.updateOffer(offerId, offerFormData);

    return res.status(HttpCode.SUCCESS).json(updatedOffer);
  });

  offersRouter.delete(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.drop(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with id: ${offerId} is not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json(offer);
  });

  offersRouter.get(`/:offerId/comments`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with id: ${offerId} is not found`
        });
    }

    const comments = commentService.findAll(offer);

    return res.status(HttpCode.SUCCESS).json(comments);
  });

  offersRouter.delete(`/comments/:commentId`, (req, res) => {
    const {commentId} = req.params;

    const deletedComment = commentService.delete(commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Comment with id: ${commentId} is not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json(deletedComment);
  });

  offersRouter.post(`/:offerId/comments`, checkParamIsInteger, ...newCommentFormFieldsRules, async (req, res) => {
    const {offerId} = req.params;
    const errors = validate(req);
    let commentData = {...req.body};

    const isOfferExists = await offerService.findOne(offerId);

    if (!isOfferExists) {
      return res.status(HttpCode.NOT_FOUND).json({
        error: true,
        status: HttpCode.NOT_FOUND,
        message: `Offer with ${offerId} not found`
      });
    }

    if (Object.keys(errors).length) {
      const offer = await offerService.findOne(offerId);
      return res.status(HttpCode.BAD_REQUEST).send({
        errors,
        offer
      });
    }

    commentData = {
      ...commentData,
      offerId,
      date: getTodayDate()
    };

    const comment = await commentService.create(commentData);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return offersRouter;

};

module.exports = {getOffersRouter};
