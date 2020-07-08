'use strict';

const Sequelize = require(`sequelize`);

class User extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      firstname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: false
      },
    }, {
      sequelize,
      tableName: `users`,
      timestamps: false
    });
  }

  static associate(models) {
    this.usersComments = this.hasMany(models.Comment, {
      as: `comments`,
      foreignKey: `userId`
    });
    this.usersOffers = this.hasMany(models.Offer, {
      as: `offers`,
      foreignKey: `userId`
    });
  }
}

module.exports = User;
