'use strict';

const {sequelize} = require(`../db-config/db`);
const {Category} = sequelize.models;

class CategoryService {

  async findAll() {
    return await Category.findAll({});
  }

  async findAllWithOffers() {
    const sql = `SELECT
                  categories.id,
                  categories.title,
                  count("offersCategories"."categoryId") AS "offersCount"
                FROM categories
                INNER JOIN "offersCategories"
                  ON "offersCategories"."categoryId" = categories.id
                GROUP BY
                  categories.id,
                  categories.title
                ORDER BY
                  COUNT("offersCategories"."categoryId") DESC;`;
    const categories = await sequelize.query(sql, {model: Category});

    return categories;
  }

  async getCategoryById(categoryId) {
    return Category.findByPk(categoryId);
  }
}

module.exports = CategoryService;
