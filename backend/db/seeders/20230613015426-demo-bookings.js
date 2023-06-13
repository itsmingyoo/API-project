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
  {
    spotId: 2,
    userId: 2,
    startDate: "2011-02-01",
    endDate: "2011-02-02",
  },
  {
    spotId: 3,
    userId: 3,
    startDate: "2011-03-01",
    endDate: "2011-03-02",
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
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, [
      { spotId: { [Op.in]: [1, 2, 3] } },
    ]);
  },
};
