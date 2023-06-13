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
    name: "One",
    description: "Free Ramen",
    price: 12345.13,
  },
  {
    ownerId: 2,
    address: "Demo Address2",
    city: "Demo",
    state: "CA",
    country: "United States",
    // lat: Math.random(),
    // lng: Math.random(),
    name: "Two",
    description: "Free Ramen",
    price: 12345.13,
  },
  {
    ownerId: 3,
    address: "Demo Address3",
    city: "Demo",
    state: "CA",
    country: "United States",
    // lat: Math.random(),
    // lng: Math.random(),
    name: "Three",
    description: "Free Ramen",
    price: 12345.13,
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      options.tableName = "Spots";
      await Spot.bulkCreate(test, options);
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["One", "Two", "Three"] },
      },
      {}
    );
  },
};
