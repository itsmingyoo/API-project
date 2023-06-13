"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const test = [
  {
    spotId: 1,
    userId: 1,
    review: "THANK YOU",
    stars: 1,
  },
  {
    spotId: 2,
    userId: 2,
    review: "THANK YOU",
    stars: 2,
  },
  {
    spotId: 3,
    userId: 3,
    review: "THANK YOU",
    stars: 3,
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Review.bulkCreate(test, { validate: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      { spotId: { [Op.in]: [1, 2, 3] } },
      {}
    );
  },
};
