'use strict';

const {check} = require(`express-validator`);
const UserService = require(`./data-service/user`);

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;

const userService = new UserService();

const newOfferFormFieldsRules = [
  check(`picture`, `Файл не выбран, неверный формат (только jpg/jpeg/png),
  большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`)
    .trim()
    .notEmpty(),
  check(`title`, `Введите название предложения`)
    .trim()
    .notEmpty()
    .escape(),
  check(`description`)
    .trim()
    .notEmpty()
    .escape()
    .withMessage(`Введите описание предложения`)
    .bail()
    .isLength({min: 50})
    .withMessage(`Описание предложения должно содержать минимум 50 символов`),
  check(`categories`, `Выберите минимум одну категорию для предложения`)
    .exists()
    .bail()
    .isArray({min: 1}),
  check(`sum`)
    .trim()
    .notEmpty()
    .escape()
    .withMessage(`Введите цену`)
    .bail()
    .isNumeric()
    .withMessage(`Значение в поле цена должно быть числом`),
  check(`type`, `Выберите тип предложения (покупка/продажа)`).notEmpty()
];

const newCommentFormFieldsRules = [
  check(`text`, `Введите комментарий`)
    .trim()
    .notEmpty()
    .escape()
    .bail()
    .isLength({min: 20})
    .withMessage(`Комментарий должен содержать минимум 20 символов`)
];

const newUserFormFieldsRules = [
  check(`avatar`, `Файл не выбран, неверный формат (только jpg/jpeg/png),
  большой размер файла (максимально: ${MAX_FILE_SIZE / MEGABYTE_IN_BYTES} мб)`)
    .trim()
    .notEmpty(),
  check(`email`)
    .trim()
    .notEmpty()
    .withMessage(`Введите почту`)
    .bail()
    .isEmail()
    .withMessage(`Почта введена некорректно`)
    .custom(async (value) => {
      const isUserExist = await userService.findUserByEmail(value);
      console.log(isUserExist);

      if (isUserExist) {
        throw Error(`Пользователь с почтой "${value}" уже зарегистрирован`);
      }

      return true;
    }),
  check(`firstname`)
    .trim()
    .notEmpty()
    .withMessage(`Введите имя`)
    .bail()
    .custom((value) => {
      const nameRegExp = /^[а-яА-ЯёЁa-zA-Z]+$/;
      return nameRegExp.test(value);
    })
    .withMessage(`Имя должно содержать только буквы`),
  check(`lastname`)
    .trim()
    .notEmpty()
    .withMessage(`Введите фамилию`)
    .bail()
    .custom((value) => {
      const nameRegExp = /^[а-яА-ЯёЁa-zA-Z]+$/;
      return nameRegExp.test(value);
    })
    .withMessage(`Фамилия должна содержать только буквы`),
  check(`password`)
    .trim()
    .notEmpty()
    .withMessage(`Введите пароль`)
    .bail()
    .isLength({min: 6})
    .withMessage(`Пароль должен содержать минимум 6 символов`),
  check(`confirm_password`)
    .trim()
    .notEmpty()
    .withMessage(`Подтвердите пароль`)
    .bail()
    .isLength({min: 6})
    .withMessage(`Пароль для подтверждения должен содержать минимум 6 символов`)
    .bail()
    .custom((value, {req}) => {

      if (value !== req.body.password) {
        throw Error(`Пароли не совпадают`);
      }

      return true;
    })
];

module.exports = {
  newOfferFormFieldsRules,
  newCommentFormFieldsRules,
  newUserFormFieldsRules
};
