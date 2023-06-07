// Step 1 - import and initialize an Express router, then create a test route and export the router
const express = require("express");
const router = express.Router();

router.get("/hello/world", function (req, res) {
  res.cookie("XSRF-TOKEN", req.csrfToken()); // requires matching tokens
  res.send("Hello World!"); // sends a text response body
});

// Step 2 - import this router into your app.js file

//export router
module.exports = router;
