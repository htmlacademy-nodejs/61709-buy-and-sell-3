'use strict';

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
    return await this._api.post(`/offers`, offerData);
  }

  async updateOffer(offerId, offerData) {
    return await this._api.put(`/offers/${offerId}`, offerData);
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

  async createComment(commentData) {
    return await this._api.post(`/offers/comments`, commentData);
  }

  async deleteComment(commentId) {
    return await this._api.delete(`/offers/comments/${commentId}`);
  }

}

module.exports = ApiService;
