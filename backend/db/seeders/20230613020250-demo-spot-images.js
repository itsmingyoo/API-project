"use strict";
/** @type {import('sequelize-cli').Migration} */
const { SpotImage } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const test = [
  {
    spotId: 1,
    url: "https://thankyousoooomuch.com",
    // url: 12418406,
    preview: true,
  },
  {
    spotId: 2,
    url: "https://thankyo.com",
    // url: 12418406,
    preview: true,
  },
  {
    spotId: 3,
    url: "https://thankyousoooomuchhh.com",
    // url: 12418406,
    preview: true,
  },
];

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      options.tableName = "Bookings";
      await SpotImage.bulkCreate(test, options);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      { spotId: { [Op.in]: [1, 2, 3] } },
      {}
    );
  },
};
