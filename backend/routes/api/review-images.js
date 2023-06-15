const express = require("express");
const {
  Spot,
  User,
  SpotImage,
  sequelize,
  Review,
  ReviewImage,
} = require("../../db/models");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await ReviewImage.findByPk(req.params.imageId);
  if (!image) {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found",
    });
  }

  const currReview = await Review.findByPk(image.reviewId);

  if (currReview.userId === req.user.id) {
    image.destroy();
  } else {
    res.status(404);
    return res.json({
      message: "Review Image couldn't be found",
    });
  }
  res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
