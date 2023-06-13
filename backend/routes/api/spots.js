const express = require("express");
const { Op } = require("sequelize");
const { Spot, User, SpotImage, sequelize, Review } = require("../../db/models");
const router = express.Router();

// 1. get all spots
router.get("/", async (req, res) => {
  let where = {};

  let allSpots = await Spot.findAll({
    attributes: [
      "id",
      "ownerId",
      "address",
      "city",
      "state",
      "country",
      "lat",
      "lng",
      "name",
      "description",
      "price",
      "createdAt",
      "updatedAt",
      [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
    ],
    where,
    include: [
      { model: Review, attributes: [] },
      {
        model: SpotImage,
        attributes: [["url", "previewImage"]],
        where: { preview: false },
      },
    ],
    group: ["Spot.id", "Reviews.id"],
  });

  let resObj = {};
  resObj.Spots = allSpots.map((spot) => {
    spot = spot.toJSON();
    // spot.SpotImages[0] points to an array, then you key into previewImage to grab the URL
    spot.previewImage = spot.SpotImages[0].previewImage;
    delete spot["SpotImages"]; // must use square bracket with '' to delete a key in an object
    return spot;
  });

  res.json(resObj);
});

// 2. Get all spots owned by current user
router.get("/spots/current", async (req, res) => {
  const findSpot = await Spot.findAll({
    //proper syntax for include if you want to use this
    // include: {
    //   model: SpotImage,
    //   attributes: ["preview"],
    // },
  });
  console.log("hellooooooo", findSpot);
  res.json(findSpot);
});

module.exports = router;
