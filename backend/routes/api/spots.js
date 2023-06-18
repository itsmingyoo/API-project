const express = require("express");
const {
  Spot,
  User,
  SpotImage,
  sequelize,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { getCurrentUser } = require("../../utils/auth");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
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
const validateQuery = [
  check("page").custom(async (value, { req }) => {
    if (req.query.size && req.query.page < 1) {
      throw new Error("Page must be greater than or equal to 1");
    }
  }),
  check("size").custom(async (value, { req }) => {
    if (req.query.size && req.query.size < 1) {
      throw new Error("Size must be greater than or equal to 1");
    }
  }),
  check("maxLat").custom(async (value, { req }) => {
    if (req.query.maxLat && req.query.maxLat < 0) {
      throw new Error("Maximum latitude is invalid");
    }
  }),
  check("minLat").custom(async (value, { req }) => {
    if (req.query.minLat && req.query.minLat < 0) {
      throw new Error("Minimum latitude is invalid");
    }
  }),
  check("maxLng").custom(async (value, { req }) => {
    if (req.query.maxLng && req.query.maxLng < 0) {
      throw new Error("Maximum longitude is invalid");
    }
  }),
  check("minLng").custom(async (value, { req }) => {
    if (req.query.minLng && req.query.minLng < 0) {
      throw new Error("Minimum longitude is invalid");
    }
  }),
  check("minPrice").custom(async (value, { req }) => {
    if (req.query.minPrice && req.query.minPrice < 0) {
      throw new Error("Minimum price must be greater than or equal to 0");
    }
  }),
  check("maxPrice").custom(async (value, { req }) => {
    if (req.query.maxPrice && req.query.maxPrice < 0) {
      throw new Error("Maximum price must be greater than or equal to 0");
    }
  }),
  handleValidationErrors,
];

// 1. get all spots
router.get("/", requireAuth, validateQuery, async (req, res) => {
  let where = {};
  let pagination = {};
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
    req.query;
  page = parseInt(page);
  size = parseInt(size);
  if (!page || isNaN(page)) page = 1;
  if (!size || isNaN(size)) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;
  if (page > 0 && size > 0) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }

  // if (minLat) where.minLat = minLat;
  // if (maxLat) where.maxLat = maxLat;
  // if (minLng) where.minLng = minLng;
  // if (maxLng) where.maxLng = maxLng;
  // if (minPrice && minPrice > 0) where.minPrice = minPrice;
  // if (maxPrice && maxPrice > 0) where.maxPrice = maxPrice;

  let allSpots = await Spot.findAll({
    where,
    include: [
      { model: Review, attributes: ["stars"] }, //include to lazy load avg then delete
      {
        model: SpotImage,
        attributes: ["url"],
        where: { preview: true },
        required: false,
      },
    ],
    ...pagination,
  });

  // LAZY LOADING
  let resObj = {};
  resObj.Spots = allSpots.map((spot) => {
    spot = spot.toJSON();
    if (spot.Reviews.length) {
      const sum = spot.Reviews.reduce((acc, curr) => {
        return acc + curr.stars; // curr = object in the array containing stars
      }, 0); // curr default value
      spot.avgRating = sum / spot.Reviews.length;
    } else {
      spot.avgRating = null;
    }

    if (spot.SpotImages.length) {
      // must use length not [0]
      spot.previewImage = spot.SpotImages[0].url;
    } else {
      spot.previewImage = null;
    }

    delete spot["SpotImages"];
    delete spot["Reviews"];

    return spot;
  });

  resObj.page = page;
  resObj.size = size;

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
  if (req.user.id === spot.ownerId) {
    const { url, preview } = req.body;
    const newSpot = await spot.createSpotImage({
      url,
      preview,
    });
    res.json({
      id: newSpot.id,
      url: newSpot.url,
      preview: newSpot.preview,
    });
  } else {
    res.statusCode = 404;
    return res.json({
      message: "Spot couldn't be found",
    });
  }
});

// 5. edit a spot
router.put("/:spotId", getCurrentUser, async (req, res) => {
  const ownerId = req.currentUser.data.id;
  const spot = await Spot.findByPk(req.params.spotId);

  if (!spot || spot === null) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

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

  if (!spot || spot === null) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }
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

// 10. create booking based on a spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  // error 404 cannot find spotId
  if (!spot) {
    res.status(404);
    return res.json({
      message: "Spot couldn't be found",
    });
  }

  //user input dates
  let { startDate, endDate } = req.body; // string date "yyyy-mm-dd"
  // convert dates to comparable numbers
  const startDateReq = new Date(startDate).getTime();
  const endDateReq = new Date(endDate).getTime();
  // test if the syntax is correct
  // console.log("start", startDateReq);
  // console.log("end", endDateReq);
  // if (startDateReq < endDateReq) console.log("true");

  //query for all bookings for spot
  const bookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId,
    },
  });
  //convert bookings to JSON
  const bookingsJSON = bookings.map((book) => {
    book = book.toJSON();
    return book;
  });

  // error 400 validation error - endDate is before startDate
  if (endDateReq <= startDateReq) {
    res.status(400);
    return res.json({
      message: "Bad Request", // (or "Validation error" if generated by Sequelize),
      errors: {
        endDate: "endDate cannot be on or before startDate",
      },
    });
  }

  // error 403 booking conflict - already booked / startDate || endDate conflicts with existing booking
  const conflictError = {
    message: "Sorry, this spot is already booked for the specified dates",
    errors: {
      startDate: "Start date conflicts with an existing booking",
      endDate: "End date conflicts with an existing booking",
    },
  };
  bookingsJSON.forEach((book) => {
    // console.log("this is a SINGLE book ===>>>", book);
    // convert each book's current booking dates
    const bookStart = new Date(book.startDate).getTime();
    const bookEnd = new Date(book.endDate).getTime();
    // case 1: if start date is b/w book start/end dates
    if (startDateReq >= bookStart && startDateReq <= bookEnd) {
      res.status(403);
      return res.json(conflictError);
    }
    // case 2: if end date is b/w book start/end dates
    if (endDateReq >= bookStart && endDateReq <= bookEnd) {
      res.status(403);
      return res.json(conflictError);
    }
  });
  // console.log("this is bookingsJSON ===>", bookingsJSON);
  // spot must NOT be booked by user already to SUCCESSFULLY book a spot
  if (spot.ownerId !== req.user.id) {
    const newBooking = await Booking.create({
      spotId: Number(req.params.spotId),
      userId: req.user.id,
      startDate,
      endDate,
    });
    res.json(newBooking);
  } else {
    res.json("You already have a current booking for this spot.");
  }
});

// 11. get all bookings for a spot based on the spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404);
    res.json({
      message: "Spot couldn't be found",
    });
  }
  const bookings = await Booking.findAll({
    attributes: [
      "id",
      "spotId",
      "userId",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ],
    where: {
      spotId: req.params.spotId,
    },
    include: {
      model: User,
      attributes: ["id", "firstName", "lastName"],
    },
  });

  const notOwner = bookings.map((book) => {
    book = book.toJSON();
    delete book.id;
    delete book.userId;
    delete book.createdAt;
    delete book.updatedAt;
    delete book.User;
    return book;
  });

  if (spot.ownerId === req.user.id) {
    res.json({
      Bookings: bookings,
    });
  } else {
    res.json({
      Bookings: notOwner,
    });
  }
});

module.exports = router;
