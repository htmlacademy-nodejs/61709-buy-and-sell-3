'use strict';

const {createAPI} = require(`../axios-api`);
const api = createAPI();

class ApiService {

  async getAllOffers() {
    return await api.get(`/offers`);
  }

  async getOfferById(offerId) {
    return await api.get(`/offers/${offerId}`);
  }

  async createNewOffer(offerData) {
    return await api.post(`/offers`, offerData);
  }

  async getAllCategories() {
    return await api.get(`/categories`);
  }

  async getSearchResult(query) {
    return await api.get(`/search?query=${encodeURI(query)}`);
  }

}

module.exports = ApiService;
