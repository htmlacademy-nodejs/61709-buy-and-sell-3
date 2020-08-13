'use strict';

const {check} = require(`express-validator`);
const MAX_FILE_SIZE = 15 * 1024 * 1024;
const MEGABYTE_IN_BYTES = 1048576;

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

module.exports = {
  newOfferFormFieldsRules,
  newCommentFormFieldsRules
};
