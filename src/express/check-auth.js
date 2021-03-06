'use strict';

const {RouteProtectionType} = require(`../constants`);

module.exports = (service, protectionType = null) => (
  async (req, res, next) => {
    try {
      const accessToken = req.cookies[`auth_token`];
      const userAuthCheckResult = await service.checkUserAuth(accessToken);

      if (userAuthCheckResult.authError && protectionType === RouteProtectionType.FULL) {
        return res.redirect(`/login`);
      }

      const {user} = userAuthCheckResult;

      if (user && protectionType === RouteProtectionType.SEMI) {
        return res.redirect(`/`);
      }

      req.user = userAuthCheckResult.user || null;
      req.app.locals.user = user || null;

      return next();
    } catch (err) {
      return next(err);
    }
  }
);

