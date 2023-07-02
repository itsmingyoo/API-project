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
  {
    ownerId: 2,
    address: "321 Oak Lane",
    city: "Chicago",
    state: "IL",
    country: "United States of America",
    lat: 41.8781136,
    lng: -87.6297982,
    name: "Dev Den",
    description: "A cozy space for developers",
    price: 180,
  },
  {
    ownerId: 3,
    address: "987 Maple Street",
    city: "Seattle",
    state: "WA",
    country: "United States of America",
    lat: 47.6062095,
    lng: -122.3320708,
    name: "Code Oasis",
    description: "Escape into the world of coding",
    price: 210,
  },
  {
    ownerId: 1,
    address: "654 Pine Avenue",
    city: "Austin",
    state: "TX",
    country: "United States of America",
    lat: 30.267153,
    lng: -97.7430608,
    name: "Byte Haven",
    description: "Where bytes come to life",
    price: 190,
  },
  {
    ownerId: 2,
    address: "432 Cedar Lane",
    city: "Boston",
    state: "MA",
    country: "United States of America",
    lat: 42.3600825,
    lng: -71.0588801,
    name: "Hackers' Hideout",
    description: "A secret place for coding enthusiasts",
    price: 175,
  },
  {
    ownerId: 3,
    address: "876 Walnut Street",
    city: "Denver",
    state: "CO",
    country: "United States of America",
    lat: 39.7392358,
    lng: -104.990251,
    name: "Byteville",
    description: "Where coding dreams come true",
    price: 220,
  },
  {
    ownerId: 1,
    address: "567 Spruce Avenue",
    city: "San Diego",
    state: "CA",
    country: "United States of America",
    lat: 32.715738,
    lng: -117.1610838,
    name: "Tech Tower",
    description: "Rising high in the tech world",
    price: 195,
  },
  {
    ownerId: 1,
    address: "876 Elm Lane",
    city: "Portland",
    state: "OR",
    country: "United States of America",
    lat: 45.5051064,
    lng: -122.6750261,
    name: "Code Central",
    description: "A hub for coding enthusiasts",
    price: 205,
  },
  {
    ownerId: 2,
    address: "345 Oak Street",
    city: "San Francisco",
    state: "CA",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "Dev House",
    description: "A home for developers",
    price: 180,
  },
  {
    ownerId: 3,
    address: "654 Maple Lane",
    city: "New York",
    state: "NY",
    country: "United States of America",
    lat: 40.7127753,
    lng: -74.0059728,
    name: "Code Camp",
    description: "Immerse yourself in coding",
    price: 195,
  },
  {
    ownerId: 2,
    address: "987 Pine Avenue",
    city: "Los Angeles",
    state: "CA",
    country: "United States of America",
    lat: 34.052235,
    lng: -118.243683,
    name: "Tech Oasis",
    description: "An oasis for tech enthusiasts",
    price: 210,
  },
  {
    ownerId: 1,
    address: "321 Cedar Street",
    city: "Chicago",
    state: "IL",
    country: "United States of America",
    lat: 41.8781136,
    lng: -87.6297982,
    name: "Code Haven",
    description: "A haven for coding enthusiasts",
    price: 185,
  },
  {
    ownerId: 2,
    address: "876 Oak Lane",
    city: "Seattle",
    state: "WA",
    country: "United States of America",
    lat: 47.6062095,
    lng: -122.3320708,
    name: "Byte Central",
    description: "The heart of coding",
    price: 225,
  },
  {
    ownerId: 3,
    address: "567 Pine Street",
    city: "Austin",
    state: "TX",
    country: "United States of America",
    lat: 30.267153,
    lng: -97.7430608,
    name: "Hackers' Haven",
    description: "A haven for hackers",
    price: 190,
  },
  {
    ownerId: 2,
    address: "876 Cedar Avenue",
    city: "Boston",
    state: "MA",
    country: "United States of America",
    lat: 42.3600825,
    lng: -71.0588801,
    name: "Code Haven",
    description: "A haven for coding enthusiasts",
    price: 175,
  },
  {
    ownerId: 3,
    address: "345 Walnut Street",
    city: "Denver",
    state: "CO",
    country: "United States of America",
    lat: 39.7392358,
    lng: -104.990251,
    name: "Tech Oasis",
    description: "An oasis for tech enthusiasts",
    price: 220,
  },
  {
    ownerId: 2,
    address: "654 Spruce Avenue",
    city: "San Diego",
    state: "CA",
    country: "United States of America",
    lat: 32.715738,
    lng: -117.1610838,
    name: "Code Tower",
    description: "Rise to the top with coding",
    price: 195,
  },
  {
    ownerId: 2,
    address: "987 Elm Lane",
    city: "Portland",
    state: "OR",
    country: "United States of America",
    lat: 45.5051064,
    lng: -122.6750261,
    name: "Byte Central",
    description: "The central hub for coding",
    price: 210,
  },
  {
    ownerId: 2,
    address: "321 Oak Street",
    city: "San Francisco",
    state: "CA",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "Dev Den",
    description: "A cozy space for developers",
    price: 185,
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
