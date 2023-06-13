"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Spot } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const test = [
  {
    ownerId: 1,
    address: "Demo Address",
    city: "Demo",
    state: "CA",
    country: "United States",
    // lat: Math.random(),
    // lng: Math.random(),
    name: "Ramen House",
    description: "Free Ramen",
    price: 12345.13,
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Spot.bulkCreate(test, { validate: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    return queryInterface.bulkDelete(options, [{ ownerId: 1 }]);
  },
};
