'use strict';

const {Router} = require(`express`);
const bcrypt = require(`bcrypt`);
const {newUserFormFieldsRules} = require(`../form-validation`);
const {HttpCode} = require(`../../constants`);
const {validate} = require(`../../utils`);
const saltRounds = 10;


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

  return userRouter;
};

module.exports = {getUserRouter};
