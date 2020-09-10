'use strict';

const {Router} = require(`express`);
const checkAuth = require(`../check-auth`);
const {RouteProtectionType} = require(`../../constants`);

const getMyRouter = (service) => {

  const myRouter = new Router();

  myRouter.get(`/`, checkAuth(service, RouteProtectionType.FULL), async (req, res, next) => {
    try {
      const user = req.user;
      const offers = await service.getOffersByUserId(user.id);
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

  myRouter.get(`/comments/:commentId`, checkAuth(service, RouteProtectionType.FULL), async (req, res, next) => {
    try {
      const {commentId} = req.params;
      await service.deleteComment(commentId);

      return res.redirect(`/my/comments`);
    } catch (err) {
      return next(err);
    }
  });

  myRouter.get(`/comments`, checkAuth(service, RouteProtectionType.FULL), async (req, res, next) => {
    try {
      const user = req.user;
      const offers = await service.getLastOfferComments(user.id);
      return res.render(`comments`, {offers});
    } catch (err) {
      return next(err);
    }
  });

  return myRouter;
};

module.exports = {getMyRouter};
