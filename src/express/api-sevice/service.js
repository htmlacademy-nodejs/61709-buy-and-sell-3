'use strict';
const {HttpCode} = require(`../../constants`);

class ApiService {

  constructor(api) {
    this._api = api;
  }

  async getAllOffers() {
    return await this._api.get(`/offers`);
  }

  async getOfferById(offerId) {
    return await this._api.get(`/offers/${offerId}`);
  }

  async getOffersByCategoryId(categoryId, activePage) {
    return await this._api.get(`/offers/category/${categoryId}`, {params: {activePage}});
  }
  async getOffersByUserId(userId) {
    return await this._api.get(`/offers/user/${userId}`);
  }

  async deleteOffer(offerId) {
    return await this._api.delete(`/offers/${offerId}`);
  }

  async getLastOfferComments(userId) {
    return await this._api.get(`/offers/${userId}/comments`);
  }

  async createNewOffer(offerData) {
    try {
      return await this._api.post(`/offers`, offerData);
    } catch (err) {
      const {response} = err;

      if (response.status === HttpCode.BAD_REQUEST) {
        const {data: {errors, categories, offerFormData}} = response;
        return {
          validationError: true,
          errors,
          categories,
          offerFormData
        };
      }

      throw err;
    }

  }

  async updateOffer(offerId, offerData) {
    try {
      return await this._api.put(`/offers/${offerId}`, offerData);
    } catch (err) {
      const {response} = err;

      if (response.status === HttpCode.BAD_REQUEST) {
        const {data: {errors, categories, offerFormData, offer}} = response;
        return {
          validationError: true,
          errors,
          categories,
          offerFormData,
          offer
        };
      }

      throw err;
    }
  }

  async getAllCategories() {
    return await this._api.get(`/categories`);
  }

  async getAllCategoriesWithOffers() {
    return await this._api.get(`/categories/offers`);
  }

  async searchOffers(query) {
    return await this._api.get(`/search?query=${encodeURI(query)}`);
  }

  async createComment(commentData, offerId) {
    try {
      return await this._api.post(`/offers/${offerId}/comments`, {...commentData});
    } catch (err) {
      const {response} = err;

      if (response.status === HttpCode.BAD_REQUEST) {
        const {data: {errors, offer}} = response;
        return {
          validationError: true,
          errors,
          offer
        };
      }

      throw err;
    }
  }

  async deleteComment(commentId) {
    return await this._api.delete(`/offers/comments/${commentId}`);
  }

}

module.exports = ApiService;
