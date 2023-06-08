const express = require("express");
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

/**USER SIGNUP API ROUTE - post
 * 1. deconstruct the req.body
 * 2. use bcrypt's hashSync function to hash user password
 * 3. save it as hashedPassword in db
 * 4. create new user w/ username & email from req.body and hashedPassword generated from bcryptjs
 * 5. use setTokenCookie to log in the user by creating a JWT cookie with the user's non-sensitive information as its payload
 * 6. send a JSON response containing user's non-sensitive info
 */
router.post("/", async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({ email, username, hashedPassword });

  const safeUser = {
    id: user.id,
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
