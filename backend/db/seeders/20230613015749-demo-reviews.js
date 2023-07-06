"use strict";
/** @type {import('sequelize-cli').Migration} */
const { Review } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

const test = [
  {
    spotId: 3,
    userId: 2,
    review: "THANK YOU1",
    stars: 1,
  },
  {
    spotId: 2,
    userId: 2,
    review: "VERY MUCH2",
    stars: 2,
  },
  {
    spotId: 3,
    userId: 1,
    review: "Great spot for coding!",
    stars: 4,
  },
  {
    spotId: 4,
    userId: 2,
    review: "Amazing place with top-notch amenities.",
    stars: 5,
  },
  {
    spotId: 5,
    userId: 3,
    review: "Perfect environment for focused coding sessions.",
    stars: 4,
  },
  {
    spotId: 1,
    userId: 4,
    review: "Cozy and inspiring atmosphere.",
    stars: 4,
  },
  {
    spotId: 1,
    userId: 5,
    review: "Hidden gem for hackers and coders.",
    stars: 5,
  },
  {
    spotId: 8,
    userId: 6,
    review: "Loved the community and collaborative vibe.",
    stars: 5,
  },
  {
    spotId: 9,
    userId: 7,
    review: "State-of-the-art facilities and helpful staff.",
    stars: 4,
  },
  {
    spotId: 10,
    userId: 8,
    review: "An excellent space to learn and network.",
    stars: 4,
  },
  {
    spotId: 11,
    userId: 9,
    review: "Highly recommend for tech enthusiasts.",
    stars: 5,
  },
  {
    spotId: 12,
    userId: 10,
    review: "Beautiful location with a friendly community.",
    stars: 4,
  },
];
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      options.tableName = "Bookings";
      await Review.bulkCreate(test, options);
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
      { spotId: { [Op.in]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] } },
      {}
    );
  },
};
