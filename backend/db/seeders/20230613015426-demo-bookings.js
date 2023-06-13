"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Booking } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const test = [
  {
    spotId: 1,
    userId: 1,
    startDate: "2011-01-01",
    endDate: "2011-01-02",
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await Booking.bulkCreate(test, { validate: true });
    } catch (e) {
      console.error(e);
      throw e;
    }
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkDelete(options, [{ spotId: 1 }]);
  },
};
