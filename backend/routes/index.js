// Step 1 - import and initialize an Express router, then create a test route and export the router
const express = require("express");
const router = express.Router();

// importing apiRouter from ./api/index.js; prefixed /api using apiRouter
const apiRouter = require("./api");

router.use("/api", apiRouter);

// This is the test route for initializing your app
// router.get("/hello/world", function (req, res) {
//   res.cookie("XSRF-TOKEN", req.csrfToken()); // requires matching tokens
//   res.send("Hello World!"); // sends a text response body
// });

// Replaced test route with a new actual api route - this route allows any dev to re-set the CSRF token cookie XSRF-TOKEN
// this route is not available in production, but will not be exclusive to the production app until you implement the frontend of the app later
//for now, it will remain available to both the dev & prod environments
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    "XSRF-Token": csrfToken,
  });
});

// Step 2 - import this router into your app.js file

//export router
module.exports = router;
