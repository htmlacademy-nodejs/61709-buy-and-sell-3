'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../service-constants`);
const offerValidator = require(`../middlewares/offer-validator`);
const commentValidator = require(`../middlewares/comment-validator`);

const offersRouter = new Router();

const getOffersRouter = (offerService, commentService) => {

  offersRouter.get(`/`, (req, res) => {
    const offers = offerService.findAll();
    res.status(HttpCode.SUCCESS).json(offers);
  });

  offersRouter.get(`/:offerId`, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with ID ${offerId} is not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json(offer);
  });

  offersRouter.post(`/`, offerValidator, (req, res) => {
    const offer = offerService.create(req.body);

    return res.status(HttpCode.CREATED).json(offer);
  });

  offersRouter.put(`/:offerId`, offerValidator, (req, res) => {
    const {offerId} = req.params;
    const isOfferExists = offerService.findOne(offerId);

    if (!isOfferExists) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with id: ${offerId} is not found`
        });
    }

    const updatedOffer = offerService.update(offerId, req.body);

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
          message: `Offer with ID ${offerId} doesn't exist`
        });
    }

    const comments = commentService.findAll(offer);

    return res.status(HttpCode.SUCCESS).json(comments);
  });

  offersRouter.delete(`/:offerId/comments/:commentId`, (req, res) => {
    const {offerId, commentId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with ID ${offerId} doesn't exist`
        });
    }

    const deletedComment = commentService.drop(offer, commentId);

    if (!deletedComment) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Comment not found`
        });
    }

    return res.status(HttpCode.SUCCESS).json(deletedComment);
  });

  offersRouter.post(`/:offerId/comments`, commentValidator, (req, res) => {
    const {offerId} = req.params;
    const offer = offerService.findOne(offerId);

    if (!offer) {
      return res.status(HttpCode.NOT_FOUND)
        .json({
          error: true,
          status: HttpCode.NOT_FOUND,
          message: `Offer with ID ${offerId} doesn't exist`
        });
    }

    const comment = commentService.create(offer, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  return offersRouter;

};

module.exports = {getOffersRouter};
