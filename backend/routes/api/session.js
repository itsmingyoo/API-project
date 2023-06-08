//IMPORTS
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

//express-validator 'check' and 'handleValidationErrors' function IMPORTS
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

// auth
const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

// router initialized
const router = express.Router();

// validateLogin middleware - composed of 'check' and 'handleValidationErrors' middleware
const validateLogin = [
  //checks to see whether or not req.body.credential and req.body.password are empty
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    //If one of them is empty, then an error will be returned as the response.
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    //If one of them is empty, then an error will be returned as the response.
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

// Log in
router.post(
  "/",
  validateLogin /*add validateLogin middleware here to connect them*/,
  async (req, res, next) => {
    const { credential, password } = req.body; // destructure user input info

    //search/query for user in the database
    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential,
        },
      },
    });

    //if user doesn't exist or passwords dont match, then create an error and send it to the error handler
    if (
      !user ||
      !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
      const err = new Error("Login failed");
      err.status = 401;
      err.title = "Login failed";
      err.errors = { credential: "The provided credentials were invalid." };
      return next(err);
    }

    //if user exists, then identify their id,email,username
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    //set their tokencookie because they are a valid user
    await setTokenCookie(res, safeUser);

    //return user with non sensitive data
    return res.json({
      user: safeUser,
    });
  }
);

// Log out 'delete' - removes the token cookie from the response and returns a JSON success message for logging out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

/** RESTORE SESSION USER EXPLANATION
 *The GET /api/session get session user route will return the session user as JSON under the key of user . If there is not a session, it will return a JSON with an empty object. req.user should be assigned when the restoreUser middleware is called as it was connected to the router in the routes/api/index.js file before the routes/api/session.js was connected to the router (router.use(restoreUser))
 *Seatrout says: this is to see who is currently logged in - gives account details of the user
 */
// Restore session user
router.get("/", (req, res) => {
  const { user } = req;
  if (user) {
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return res.json({
      user: safeUser,
    });
  } else return res.json({ user: null });
  /*Test the route by navigating to http://localhost:8000/api/session. You should see the current session user information if you have the token cookie. If you don't have a token cookie, you should see an empty object returned. http://localhost:8000/api/csrf/restore to grab XSRF token
   */
});

//EXPORT
module.exports = router;
