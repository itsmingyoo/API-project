"use strict";
const { Model, Validator } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.hasMany(models.Review, {
        foreignKey: "spotId",
        otherKey: "userId",
        onDelete: "CASCADE",
      });
      Spot.belongsTo(models.User, { foreignKey: "ownerId" });
      Spot.hasMany(models.SpotImage, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      Spot.hasMany(models.Booking, {
        foreignKey: "spotId",
        onDelete: "CASCADE",
      });
      // Spot.belongsToMany(models.User, {
      //   through: models.Booking,
      //   foreignKey: "spotId",
      //   otherKey: "userId",
      //   onDelete: "CASCADE",
      // });
      // Spot.belongsToMany(models.User, {
      //   through: models.Review,
      //   foreignKey: "spotId",
      //   otherKey: "userId",
      //   onDelete: "CASCADE",
      // });
    }
  }
  Spot.init(
    {
      ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // validate: {
        //   isFirstCap(value) {
        //     let arr = value.split(" ");
        //     for (let i = 0; i < arr.length; i++) {
        //       if (arr[i][0] !== arr[i][0].toUpperCase()) {
        //         throw new Error(
        //           "First letter of each word in address should be capitalized"
        //         );
        //       }
        //     }
        //   },
        // },
      },
      city: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   isFirstCap(value) {
        //     let arr = value.split(" ");
        //     for (let i = 0; i < arr.length; i++) {
        //       if (!Validator.isUppercase(arr[i][0])) {
        //         throw new Error(
        //           "First letter of each word in city should be capitalized"
        //         );
        //       }
        //     }
        //   },
        // },
      },
      state: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 2],
          isUppercase: true,
        },
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
        // validate: {
        //   isFirstCap(value) {
        //     let arr = value.split(" ");
        //     for (let i = 0; i < arr.length; i++) {
        //       if (!Validator.isUppercase(arr[i][0])) {
        //         throw new Error(
        //           "First letter of each word in country should be capitalized"
        //         );
        //       }
        //     }
        //   },
        // },
      },
      lat: DataTypes.DECIMAL,
      lng: DataTypes.DECIMAL,
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        validate: {
          isDecimal: true,
        },
      },
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
