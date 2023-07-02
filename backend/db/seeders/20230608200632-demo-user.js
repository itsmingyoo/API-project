"use strict";
/** @type {import('sequelize-cli').Migration} */
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Users";
    return queryInterface.bulkInsert(
      options,
      [
        {
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
          firstName: "demo",
          lastName: "lition",
        },
        {
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
          firstName: "fake",
          lastName: "userone",
        },
        {
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
          firstName: "fake",
          lastName: "user2",
        },
        {
          email: "user3@user.io",
          username: "FakeUser3",
          hashedPassword: bcrypt.hashSync("password4"),
          firstName: "fake",
          lastName: "user3",
        },
        {
          email: "user4@user.io",
          username: "FakeUser4",
          hashedPassword: bcrypt.hashSync("password5"),
          firstName: "fake",
          lastName: "user4",
        },
        {
          email: "user5@user.io",
          username: "FakeUser5",
          hashedPassword: bcrypt.hashSync("password6"),
          firstName: "fake",
          lastName: "user5",
        },
        {
          email: "user6@user.io",
          username: "FakeUser6",
          hashedPassword: bcrypt.hashSync("password7"),
          firstName: "fake",
          lastName: "user6",
        },
        {
          email: "user7@user.io",
          username: "FakeUser7",
          hashedPassword: bcrypt.hashSync("password8"),
          firstName: "fake",
          lastName: "user7",
        },
        {
          email: "user8@user.io",
          username: "FakeUser8",
          hashedPassword: bcrypt.hashSync("password9"),
          firstName: "fake",
          lastName: "user8",
        },
        {
          email: "user9@user.io",
          username: "FakeUser9",
          hashedPassword: bcrypt.hashSync("password10"),
          firstName: "fake",
          lastName: "user9",
        },
        {
          email: "user10@user.io",
          username: "FakeUser10",
          hashedPassword: bcrypt.hashSync("password11"),
          firstName: "fake",
          lastName: "user10",
        },
        {
          email: "user11@user.io",
          username: "FakeUser11",
          hashedPassword: bcrypt.hashSync("password12"),
          firstName: "fake",
          lastName: "user11",
        },
        {
          email: "user12@user.io",
          username: "FakeUser12",
          hashedPassword: bcrypt.hashSync("password13"),
          firstName: "fake",
          lastName: "user12",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Users";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: {
          [Op.in]: [
            "Demo-lition",
            "FakeUser1",
            "FakeUser2",
            "FakeUser3",
            "FakeUser4",
            "FakeUser5",
            "FakeUser6",
            "FakeUser7",
            "FakeUser8",
            "FakeUser9",
            "FakeUser10",
            "FakeUser11",
            "FakeUser12",
          ],
        },
      },
      {}
    );
  },
};
