'use strict';

const util = require(`util`);
const {Router} = require(`express`);
const bcrypt = require(`bcrypt`);
const jwt = require(`jsonwebtoken`);
const {
  newUserFormFieldsRules,
  loginUserFormFieldsRules
} = require(`../form-validation`);
const {HttpCode} = require(`../../constants`);
const {validate, generateTokens} = require(`../../utils`);
const saltRounds = 10;

const jwtVerify = util.promisify(jwt.verify);

const userRouter = new Router();

const getUserRouter = (userService) => {

  userRouter.post(`/`, ...newUserFormFieldsRules, async (req, res) => {
    const errors = validate(req);
    let userFormData = {...req.body};

    if (errors.length > 0) {
      return res.status(HttpCode.BAD_REQUEST).send({errors});
    }

    userFormData = {
      ...userFormData,
      password: await bcrypt.hash(userFormData.password, saltRounds)
    };

    const newUserData = await userService.create(userFormData);
    return res.status(HttpCode.CREATED).json(newUserData);
  });

  userRouter.post(`/login`, loginUserFormFieldsRules, async (req, res) => {
    let {email, password} = req.body;
    const errors = validate(req);

    const user = await userService.findUserByEmail(email);

    if (!user) {
      errors.push({msg: `Пользователь с почтой "${email}" не зарегистрирован`});
    }

    if (user) {
      const isPasswordsMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordsMatch) {
        errors.push({msg: `Неверный пароль`});
      }
    }

    if (errors.length > 0) {
      return res.status(HttpCode.BAD_REQUEST).send({errors});
    }

    const {accessToken} = generateTokens(user.id);
    return res.status(HttpCode.SUCCESS).json({accessToken, user});
  });

  userRouter.post(`/auth`, async (req, res) => {
    try {
      const {accessToken} = req.body;

      if (!accessToken) {
        return res.sendStatus(HttpCode.UNAUTHORIZED);
      }

      const jwtVerifyResult = await jwtVerify(accessToken, process.env.JWT_ACCESS_SECRET);

      const user = await userService.findUserById(jwtVerifyResult.id);
      return res.status(HttpCode.SUCCESS).json({user});
    } catch (err) {
      return res.sendStatus(HttpCode.UNAUTHORIZED);
    }
  });

  return userRouter;
};

module.exports = {getUserRouter};
