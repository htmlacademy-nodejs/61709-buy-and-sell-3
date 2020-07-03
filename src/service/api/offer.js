'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

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

  offersRouter.get(`/user/:userId/comments`, async (req, res) => {
    const {userId} = req.params;
    const offers = await offerService.findLastOfferComments(userId);

    return res.status(HttpCode.SUCCESS).json(offers);
  });

  offersRouter.get(`/category/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const isCategoryExist = await categoryService.getCategoryById(categoryId);

    if (!isCategoryExist) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Category with id: ${categoryId} is not found`
        });
    }

    const {category, offers} = await offerService.findOffersByCategoryId(categoryId);

    return res.status(HttpCode.SUCCESS).json({category, offers});
  });

  offersRouter.delete(`/:offerId`, async (req, res) => {
    const {offerId} = req.params;

    const offer = await offerService.deleteOffer(offerId);

    return res.status(HttpCode.CREATED).json(offer);
  });

  offersRouter.post(`/`, offerValidator, async (req, res) => {
    const offerData = req.body;
    const offer = await offerService.createOffer(offerData);

    return res.status(HttpCode.CREATED).json(offer);
  });

  offersRouter.put(`/:offerId`, offerValidator, async (req, res) => {
    const {offerId} = req.params;
    const offerData = req.body;
    const isOfferExist = await offerService.findOne(offerId);

    if (!isOfferExist) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with id: ${offerId} is not found`
        });
    }

    const updatedOffer = await offerService.updateOffer(offerId, offerData);

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

  offersRouter.post(`/comments`, commentValidator, async (req, res) => {
    const commentData = req.body;
    const comment = await commentService.create(commentData);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return offersRouter;

};

module.exports = {getOffersRouter};
