// Step - 1 - import all these
const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors"); // cors security
const csurf = require("csurf"); // csrf prevention
const helmet = require("helmet"); // xxs prevention
const cookieParser = require("cookie-parser");

// Router import
const routes = require("./routes");

// Step - 2 - create a var isProduction = true to check the environment key in the config file (backend/config/index.js)
const { environment } = require("./config");
const isProduction = environment === "production";

// Step - 3 - Initialize Express application
const app = express();

// Step - 4 - Connect morgan middleware for logging info about req/res
app.use(morgan("dev"));

// Step - 5 - add 'cookie-parser' middleware for parsing cookies and the express.json middleware for parsing JSON bodies of requests with Content-Type of "application/json"
app.use(cookieParser());
app.use(express.json());

// Step - 6 - add several security middlewares
// Security Middleware
if (!isProduction) {
  // enable cors only in development
  app.use(cors());
}

// helmet helps set a variety of headers to better secure your app
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method - *can't be read by JS
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

// Step - 7 - setup routes - create a 'routes' folder in the backend folder & create an index.js file in that folder

// Connect all the routes
app.use(routes);
//Export the app
module.exports = app;
