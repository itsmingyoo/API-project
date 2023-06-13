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
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "CA",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
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
        name: { [Op.in]: ["App Academy", "Two", "Three"] },
      },
      {}
    );
  },
};
