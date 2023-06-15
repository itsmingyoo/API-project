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
const validateSpot = [
  check("address")
    .exists({ checkFalsy: true })
    .withMessage("Street address is required"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  check("country")
    .exists({ checkFalsy: true })
    .withMessage("Country is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat()
    .withMessage("Longitude is not valid"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 50 })
    .withMessage("Name must be less than 50 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("price")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Price per day is required"),
  handleValidationErrors,
];

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
        where: { preview: true },
      },
    ],
    group: ["Spot.id", "Reviews.id", "SpotImages.id"],
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
router.get("/current", async (req, res) => {
  const findSpots = await Spot.findAll({
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
    include: [
      { model: Review, attributes: [] },
      {
        model: SpotImage,
        attributes: [["url", "previewImage"]],
        where: { preview: true },
        required: false,
      },
    ],
    group: ["Spot.id", "Reviews.id", "SpotImages.id"],
    where: {
      ownerId: req.user.id,
    },
  });

  let resObj = {};
  resObj.Spots = await Promise.all(
    findSpots.map(async (spot) => {
      spot = spot.toJSON();
      spot.previewImage = await SpotImage.findOne({
        attributes: ["url"],
        where: {
          spotId: spot.id,
          preview: true,
        },
      });
      //   console.log(spot); //asdf

      //edge case for null values to avoid errors
      if (spot.previewImage !== null) {
        spot.previewImage = spot.previewImage.url;
      } else {
        spot.previewImage = "image url";
      }
      delete spot["SpotImages"];
      return spot;
    })
  );
  res.json(resObj);
});

// 3. Create a Spot
router.post("/", getCurrentUser, validateSpot, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    req.body;
  if (
    !address ||
    !city ||
    !state ||
    !country ||
    !lat ||
    !lng ||
    !name ||
    !description ||
    !price
  ) {
    res.statusCode = 400;
    res.json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude is not valid",
        lng: "Longitude is not valid",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day is required",
      },
    });
  }
  const ownerId = req.currentUser.data.id;
  const newSpot = await Spot.create({
    ownerId,
    address,
    city,
    state,
    country,
    lat,
    lng,
    name,
    description,
    price,
  });
  res.json(newSpot);
});

// 4. add an image to a spot based on the spot's id
router.post("/:spotId/images", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot || spot === null) {
    res.statusCode = 404;
    return res.json({
      message: "Spot couldn't be found",
    });
  }
  const { url, preview } = req.body;
  if (req.user.id === spot.ownerId) {
    spot.toJSON();
    spot.url = url;
    spot.preview = preview;
  } else {
    res.statusCode = 404;
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  res.json({
    id: spot.id,
    url,
    preview,
  });
});

// 5. edit a spot
router.put("/:spotId", getCurrentUser, async (req, res) => {
  const ownerId = req.currentUser.data.id;
  const spot = await Spot.findByPk(req.params.spotId);
  let editThisSpot = spot.toJSON();
  if (spot.ownerId === ownerId) {
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    if (address) editThisSpot.address = address;
    if (city) editThisSpot.city = city;
    if (state) editThisSpot.state = state;
    if (country) editThisSpot.country = country;
    if (lat) editThisSpot.lat = lat;
    if (lng) editThisSpot.lng = lng;
    if (name) editThisSpot.name = name;
    if (description) editThisSpot.description = description;
    if (price) editThisSpot.price = price;
    await editThisSpot.save; // save is not a function (*(((*((*(*(*))))))))
    res.json(editThisSpot);
  } else {
    res.statusCode = 400;
    res.json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        address: "Street address is required",
        city: "City is required",
        state: "State is required",
        country: "Country is required",
        lat: "Latitude is not valid",
        lng: "Longitude is not valid",
        name: "Name must be less than 50 characters",
        description: "Description is required",
        price: "Price per day is required",
      },
    });
  }
});

// 6. delete route
router.delete("/:spotId", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (spot === null || !spot.ownerId) {
    return res.json({
      message: "Spot couldn't be found",
    });
  }
  if (req.user.id === spot.ownerId) {
    spot.destroy();
  } else {
    res.statusCode = 404;
    return res.json({
      message: "Spot couldn't be found",
    });
  }
  res.json({
    message: "Successfully deleted",
  });
});

// 7. get spot details from id
router.get("/:spotId", async (req, res) => {
  let spot = await Spot.findByPk(req.params.spotId, {
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("stars")), "numReviews"],
        [sequelize.fn("AVG", sequelize.col("stars")), "avgRating"],
      ],
    },
    include: [
      {
        model: Review,
        attributes: [],
      },
      {
        model: SpotImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
    group: ["Spot.id", "Reviews.id", "SpotImages.id", "User.id"],
  });

  //   console.log(spot);
  //   console.log(spot.id);
  spot = spot.toJSON();
  if (spot.ownerId !== null && spot.id !== null) {
    spot.Owner = spot.User;
    delete spot.User;
  } else {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  res.json(spot);
});

// 8. create a review for a spotId
router.post("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  const spotReviews = await spot.getReviews();

  // check if user has a review for the current spot
  if (spotReviews !== null) {
    for (let i = 0; i < spotReviews.length; i++) {
      if (req.user.id === spotReviews[i].userId) {
        res.status(500);
        return res.json({
          message: "User already has a review for this spot",
        });
      }
    }
  }

  if (req.user.id === spot.ownerId) {
    const { review, stars } = req.body;
    const newReview = await Review.create({
      // id: req.params.spotId,
      userId: req.user.id,
      spotId: spot.id,
      review,
      stars,
    });
    res.status(201);
    return res.json(newReview);
  } else {
    res.status(400);
    return res.json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        review: "Review text is required",
        stars: "Stars must be an integer from 1 to 5",
      },
    });
  }
});

// 9. get spot reviews
router.get("/:spotId/reviews", async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot || spot === null) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }
  const spotReviews = await spot.getReviews({
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
      {
        model: ReviewImage,
        attributes: ["id", "url"],
      },
    ],
  });

  res.json(spotReviews);
});

module.exports = router;
