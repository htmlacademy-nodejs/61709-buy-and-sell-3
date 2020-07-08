'use strict';

const {check} = require(`express-validator`);

const newOfferFormFieldsRules = [
  check(`title`, `Введите название предложения`).trim().notEmpty(),
  check(`description`)
    .trim()
    .notEmpty()
    .withMessage(`Введите описание предложения`)
    .bail()
    .isLength({min: 50})
    .withMessage(`Описание предложения должно содержать минимум 50 символов`),
  check(`categories`, `Выберите минимум одну категорию для предложения`).exists().bail().isArray({min: 1}),
  check(`sum`)
    .trim()
    .notEmpty()
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
    .bail()
    .isLength({min: 20})
    .withMessage(`Комментарий должен содержать минимум 20 символов`)
];

module.exports = {
  newOfferFormFieldsRules,
  newCommentFormFieldsRules
};
