'use strict';

class CategoryService {
  constructor(offers) {
    this._offers = offers;
  }

  findAll() {
    return [
      ...new Set(
          this._offers.reduce((categoriesList, article) => categoriesList.concat(article.category), [])
      )
    ];
  }
}

module.exports = CategoryService;
