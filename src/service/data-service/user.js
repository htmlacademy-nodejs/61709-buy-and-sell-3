'use strict';

const {sequelize} = require(`../db-config/db`);
const {User} = sequelize.models;

class CategoryService {

  async findAll() {
    return await User.findAll();
  }

  async create(userData) {
    return await User.create(userData, {returning: true});
  }

  async findUserByEmail(email) {
    return await User.findOne({where: {email}});
  }

  async findUserById(userId) {
    return await User.findOne({where: {id: userId}});
  }
}

module.exports = CategoryService;
