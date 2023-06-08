// THIS FILE STORES AUTH HELPER FUNCTIONS
// imports
const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

/**
 * setTokenCookie using JWT after a user is logged in or signed up
 * It takes in the response and the session user and generates a JWT using the imported secret. It is set to expire in however many seconds you set on the JWT_EXPIRES_IN key in the .env file.
 * DO NOT ADD USER'S HASHEDPASSWORD ATTRIBUTE TO THE PAYLOAD
 * After the JWT is created, it's set to an HTTP-only cookie on the response as a token cookie.
 */
// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
  // Create the token.
  const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  const token = jwt.sign(
    { data: safeUser },
    secret,
    { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
  );

  const isProduction = process.env.NODE_ENV === "production";

  // Set the token cookie
  res.cookie("token", token, {
    maxAge: expiresIn * 1000, // maxAge in milliseconds
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction && "Lax",
  });

  return token;
};

/**
 * restoreUser
 * create middleware function that will verify and parse the JWT's payload and search the DB for a User with the id in the payload
 * although the defaultScope in User model prevents hashedpw,email,create/updatedAt attributes, you however, want to include the email, created/updatedAt to be returned in the search but not hashedpw
 * if (user) save user to req.user, else clear token cookie from response and set req.user = null
 */
const restoreUser = (req, res, next) => {
  // token parsed from cookies
  const { token } = req.cookies;
  req.user = null;
  //jwt.verify(token, secretOrPublicKey, [options, callback])
  return jwt.verify(token, secret, null, async (err, jwtPayload) => {
    if (err) {
      return next(); // if theres a verification error, just go next without letting the user know anything. this function is only to verify the token
    }

    try {
      const { id } = jwtPayload.data;
      req.user = await User.findByPk(id, {
        attributes: {
          include: ["email", "createdAt", "updatedAt"],
        },
      });
    } catch (e) {
      // this catch is for defensive coding - cannot have an error that stops code during production
      res.clearCookie("token");
      return next();
    }

    if (!req.user) res.clearCookie("token");

    return next();
  });
};

/**
 * requireAuth
 * create express middleware and define it as an array with the restoreUser middleware function as the first element in the array
 * 1. ensures valid JWT cookie exists => session user will be loaded into the req.user attributes
 * 2. the second middleware will check req.user and go to next MW if there is a session user present
 * 3. if no user, then an error will be created and passed along
 * 4. requireAuth will be connected directly to route handlers where there needs to be a current user logged in for the actions in those route handlers
 */
// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
  if (req.user) return next();

  const err = new Error("Authentication required");
  err.title = "Authentication required";
  err.errors = { message: "Authentication required" };
  err.status = 401;
  return next(err);
};

// export these FUNCTIONS
module.exports = { setTokenCookie, restoreUser, requireAuth };
