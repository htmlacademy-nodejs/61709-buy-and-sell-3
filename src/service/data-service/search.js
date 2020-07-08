'use strict';

const {sequelize} = require(`../db-config/db`);
const {Op} = require(`sequelize`);
const {Offer} = sequelize.models;

class SearchService {

  async findAll(searchText) {
    const offers = Offer.findAll({
      include: [`categories`],
      where: {
        title: {
          [Op.iLike]: `%${searchText}%`
        }
      }
    });

    return offers;
  }

}

module.exports = SearchService;
