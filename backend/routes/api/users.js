const express = require("express");
const bcrypt = require("bcryptjs");

// express-validator & handleValidationErrors imports
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// auth
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

// router initialized
const router = express.Router();

// validateSignup middleware composed of the express-validator 'check' and handleValidationErrors function
const validateSignup = [
  //checks to see if req.body.email exists and is an email,
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  //req.body.username is a minimum length of 4 and is not an email
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  //req.body.password is not empty and has a minimum length of 6
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  //If at least one of the req.body values fail the check, an error will be returned as the response.
  handleValidationErrors,
];

/**USER SIGNUP API ROUTE - post
 * 1. deconstruct the req.body
 * 2. use bcrypt's hashSync function to hash user password
 * 3. save it as hashedPassword in db
 * 4. create new user w/ username & email from req.body and hashedPassword generated from bcryptjs
 * 5. use setTokenCookie to log in the user by creating a JWT cookie with the user's non-sensitive information as its payload
 * 6. send a JSON response containing user's non-sensitive info
 */
router.post("/", validateSignup, async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    email,
    username,
    hashedPassword,
    firstName,
    lastName,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

// EXPORT ROUTER
module.exports = router;
