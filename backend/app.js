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

// Sequelize Error-handler
const { ValidationError } = require("sequelize");

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

// Catch unhandled requests and forward to error handler.
app.use((req, res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

// Sequelize Error-Handler with ValidationError
app.use((err, req, res, next) => {
  // check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

// Last Error Formatter Error-Handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || "Server Error",
    message: err.message,
    errors: err.errors,
    stack: isProduction ? null : err.stack,
  });
});

// FETCH TEST - REPLACE XSRF TOKEN - TO GRAB IT GO TO
// localhost:8000/api/csrf/restore
// fetch("/not-found", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     "XSRF-TOKEN": `3yoqmNnD-3iL9FRPsTRAmybNMdQKeHahN0l8`,
//   },
//   body: JSON.stringify({ hello: "world" }),
// })
//   .then((res) => res.json())
//   .then((data) => console.log(data));

//Export the app
module.exports = app;
