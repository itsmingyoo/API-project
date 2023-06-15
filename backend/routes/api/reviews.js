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
  res.json({ Reviews: reviewsList });
});

// 2. add image to a review based on the review's id
router.post("/:reviewId/images", async (req, res) => {
  let currReview = await Review.findByPk(req.params.reviewId, {
    include: {
      model: ReviewImage,
    },
  });

  //case of not found
  if (!currReview) {
    res.status(404);
    return res.json({
      message: "Review couldn't be found",
    });
  }

  //case of over 10
  if (currReview.ReviewImages.length > 9) {
    //starts at 3 bc of 3 test seeders
    res.status(403);
    return res.json({
      message: "Maximum number of images for this resource was reached",
    });
  }

  if (currReview.userId === req.user.id) {
    const { url } = req.body;
    const newUrl = await ReviewImage.create({
      url,
      reviewId: currReview.id,
    });
    return res.json({ id: newUrl.id, url: newUrl.url }); // remember this: including key-values
  }
});

module.exports = router;
