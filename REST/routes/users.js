// third party packages
const express = require("express");
const { body } = require("express-validator");

const User = require("./../models/user");
const userController = require("./../controller/users");

const router = express.Router();

router.post(
  "/",
  [
    body("email")
      .isEmail()
      .withMessage("Please add a valid E-Mail")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject("E-Mail-Adress already exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 8 }),
    body("name")
      .trim()
      .not()
      .isEmpty()
  ],
  userController.signup
);

router.post("/login", userController.login);

module.exports = router;
