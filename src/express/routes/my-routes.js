'use strict';

const {Router} = require(`express`);

const getMyRouter = (service) => {

  const myRouter = new Router();

  myRouter.get(`/`, async (req, res, next) => {
    try {
      const offers = await service.getOffersByUserId(1);
      return res.render(`my-offers`, {offers});
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/offers/:offerId`, async (req, res, next) => {
    try {
      const {offerId} = req.params;
      await service.deleteOffer(offerId);

      return res.redirect(`/my`);
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments/:commentId`, async (req, res, next) => {
    try {
      const {commentId} = req.params;
      await service.deleteComment(commentId);

      return res.redirect(`/my/comments`);
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments`, async (req, res, next) => {
    try {
      const offers = await service.getLastOfferComments(1);
      return res.render(`comments`, {offers});
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
