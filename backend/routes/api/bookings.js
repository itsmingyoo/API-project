const express = require("express");
const { Op } = require("sequelize");
const {
  Spot,
  User,
  SpotImage,
  sequelize,
  Review,
  ReviewImage,
  Booking,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  let allBookings = await Booking.findAll({
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
      userId: req.user.id,
    },
    include: {
      model: Spot,
      include: {
        model: SpotImage,
        attributes: [["url", "previewImage"]],
      },
    },
  });
  const bookingsJSON = allBookings.map((booking) => {
    booking = booking.toJSON();
    if (booking.Spot.SpotImages !== null || booking.Spot.SpotImages) {
      booking.Spot.previewImage = booking.Spot.SpotImages[0].previewImage;
      // console.log(booking);
      // console.log(booking.Spot.SpotImages[0].previewImage);
      delete booking.Spot["createdAt"];
      delete booking.Spot["updatedAt"];
      delete booking.Spot["SpotImages"];
    }
    return booking;
  });
  res.json({ Bookings: bookingsJSON });
});

module.exports = router;
