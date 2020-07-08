'use strict';

const Sequelize = require(`sequelize`);

class Offer extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sum: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }, {
      sequelize,
      tableName: `offers`,
      timestamps: false
    });
  }

  static associate(models) {
    this.offersUsers = this.belongsTo(models.User, {
      as: `users`,
      foreignKey: `userId`,
    });
    this.offersComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `offerId`
    });
    this.offersCategories = this.belongsToMany(models.Category, {
      through: `offersCategories`,
      as: `categories`,
      foreignKey: `offerId`,
      timestamps: false,
      paranoid: false
    });
  }
}

module.exports = Offer;
