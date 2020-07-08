'use strict';

const {sequelize} = require(`../db-config/db`);
const {Offer, Comment, Category, offersCategories, User} = sequelize.models;
const NEW_OFFERS_LIMIT = 8;
const POPULAR_OFFERS_LIMIT = 8;

class OfferService {

  async createOffer(offerData) {
    const newOffer = await Offer.create(offerData, {returning: true});
    await newOffer.addCategories(offerData.categories);
    return newOffer;
  }

  async deleteOffer(offerId) {
    return await Offer.destroy({where: {id: offerId}});
  }

  async findAll() {
    const offers = await Offer.findAll({
      include: [`categories`],
      order: [[`date`, `DESC`]],
      limit: NEW_OFFERS_LIMIT
    });

    return offers;
  }

  async findOffersByCategoryId(categoryId) {
    const category = await Category.findByPk(categoryId);
    const offers = await category.getOffers({include: [`categories`]});

    return {category, offers};
  }

  async findByUserId(userId) {
    const offers = await Offer.findAll({
      include: [`categories`],
      where: {userId},
      order: [[`date`, `DESC`]]
    });

    return offers;
  }

  async findLastOfferComments(userId) {
    const offers = await Offer.findAll({
      include: [
        {
          model: Comment,
          as: `comments`,
          include: [`users`],
          required: true
        },
        `categories`
      ],
      where: {userId},
      order: sequelize.literal(`"comments"."date" DESC`)
    });

    return offers;
  }

  async findMostDiscussedOffers() {

    const offers = await Offer.findAll({
      attributes: {
        include: [[sequelize.fn(`count`, sequelize.col(`comments.offerId`)), `commentsCount`]]
      },
      include: [
        {
          model: Comment,
          as: `comments`,
          attributes: [],
          required: true,
          duplicating: false
        },
        {
          model: Category,
          as: `categories`,
          duplicating: false
        }
      ],
      group: [`Offer.id`, `categories.id`, `categories->offersCategories.offerId`, `categories->offersCategories.categoryId`],
      order: sequelize.literal(`"commentsCount" DESC`),
      limit: POPULAR_OFFERS_LIMIT
    });

    return offers;
  }

  async findOne(offerId) {
    const offer = await Offer.findByPk(offerId, {
      include: [
        `categories`,
        `users`,
        {
          model: Comment,
          as: `comments`,
          include: [{
            model: User,
            as: `users`,
            nested: true,
            attributes: [`firstname`, `lastname`, `avatar`]
          }]
        }
      ]
    });

    return offer;
  }

  async updateOffer(offerId, offerData) {
    const [updateResult, [updatedOffer]] = await Offer.update(offerData, {
      where: {id: offerId},
      returning: true
    });

    if (!updateResult) {
      throw Error(`Offer is not updated: ${offerId}`);
    }

    await offersCategories.destroy({where: {offerId}});
    await updatedOffer.addCategories(offerData.categories);

    return updatedOffer;
  }

}

module.exports = OfferService;
