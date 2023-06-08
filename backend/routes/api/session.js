//IMPORTS
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

// Log in
router.post("/", async (req, res, next) => {
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
  if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
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
});

//EXPORT
module.exports = router;
