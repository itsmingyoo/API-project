"use strict";
/** @type {import('sequelize-cli').Migration} */
const { ReviewImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const test = [
  {
    reviewId: 1,
    url: "https://thankyou1.com",
  },
  {
    reviewId: 2,
    url: "https://thankyou2.com",
  },
  {
    reviewId: 3,
    url: "https://thankyou3.com",
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await ReviewImage.bulkCreate(test, { validation: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "ReviewImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      { reviewId: { [Op.in]: [1, 2, 3] } },
      {}
    );
  },
};
