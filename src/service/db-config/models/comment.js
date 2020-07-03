'use strict';

const Sequelize = require(`sequelize`);

class Comment extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      offerId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: `comments`,
      timestamps: false
    });
  }

  static associate(models) {
    this.offersComments = this.belongsTo(models.Offer, {
      as: `offers`,
      foreignKey: `offerId`
    });
    this.usersComments = this.belongsTo(models.User, {
      as: `users`,
      foreignKey: `userId`
    });
  }
}

module.exports = Comment;
