const express = require("express");
const { Op } = require("sequelize");
const {
  Spot,
  User,
  SpotImage,
  sequelize,
  Review,
  ReviewImage,
} = require("../../db/models");
const { getCurrentUser } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

// 1. get all reviews for current user
router.get("/current", async (req, res) => {
  const reviews = await Review.findAll({
    attributes: [
      "id",
      "userId",
      "spotId",
      "review",
      "stars",
      "createdAt",
      "updatedAt",
    ],
    where: {
      userId: req.user.id,
    },
    include: [
      { model: User, attributes: ["id", "firstName", "lastName"] },
      {
        model: Spot,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: SpotImage,
          attributes: [["url", "previewImage"]],
        },
      },
      { model: ReviewImage, attributes: ["id", "url"] },
    ],
  });

  let reviewsList = [];
  reviews.forEach((review) => {
    reviewsList.push(review.toJSON());
  });

  reviewsList.forEach((review) => {
    review.Spot.SpotImages.forEach((image) => {
      //   console.log("this is each image", image); // {previewImage: 'url'}
      //   console.log("this is keying into each image", image.previewImage); // url
      review.Spot.previewImage = image.previewImage;
      delete review.Spot["SpotImages"];
    });
  });
  //   console.log(reviewsList);
  res.json(reviewsList);
});

module.exports = router;
