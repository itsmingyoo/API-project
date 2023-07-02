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
    url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    preview: true,
  },
  {
    spotId: 2,
    url: "https://images.unsplash.com/photo-1600566753104-685f4f24cb4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    preview: true,
  },
  {
    spotId: 3,
    url: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
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
