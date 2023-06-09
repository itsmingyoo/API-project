const express = require("express");
const { Spot, SpotImage } = require("../../db/models");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const router = express.Router();

router.delete("/:imageId", requireAuth, async (req, res) => {
  const spotImage = await SpotImage.findOne({
    where: {
      id: req.params.imageId,
    },
  });

  if (!spotImage) {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found",
    });
  }

  const spot = await Spot.findByPk(spotImage.spotId);

  if (spot.ownerId === req.user.id) {
    spotImage.destroy();
  } else {
    res.status(404);
    return res.json({
      message: "Spot Image couldn't be found",
    });
  }
  res.json({
    message: "Successfully deleted",
  });
});

module.exports = router;
