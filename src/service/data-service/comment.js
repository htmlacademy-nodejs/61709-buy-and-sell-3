'use strict';
const {sequelize} = require(`../db-config/db`);
const {Comment} = sequelize.models;

class CommentService {

  async create(commentData) {
    return await Comment.create(commentData, {returning: true});
  }

  async delete(commentId) {
    return await Comment.destroy({where: {id: commentId}});
  }

}

module.exports = CommentService;
