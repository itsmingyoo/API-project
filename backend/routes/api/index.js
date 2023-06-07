// backend/routes/api/index.js
// remember to import this to routes/index.js and connect it to the router there
const router = require("express").Router();

// test route
router.post("/test", function (req, res) {
  res.json({ requestBody: req.body });
});

module.exports = router;
