// 3rd party
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// internal
const User = require("./../models/user");
const config = require("./../config.json");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPW => {
      const user = new User({
        email: email,
        name: name,
        password: hashedPW
      });
      return user.save();
    })
    .then(result => {
      console.log("user with ID:" + result._id + " was created!");
      res.status(201).json({
        message: "Succesful created",
        userId: result._id,
        actions: {
          login: {
            href: "http://localhost:8080/users/login",
            rel: "login",
            method: "POST",
            description: "login to existing account"
          },
          welcome: {
            href: "http://localhost:8080/welcome",
            rel: "Welcome-Page",
            method: "GET",
            description: "go back to welcome page"
          }
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        const error = new Error("user not found");
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error("Password wrong");
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString()
        },
        config.secretKey,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: loadedUser._id.toString(),
        message: "login succesful!",
        actions: {
          getPosts: {
            href: "http://localhost:8080/posts",
            rel: "posts",
            method: "GET",
            description: "list all existing posts"
          },
          createPost: {
            href: "http://localhost:8080/posts",
            rel: "posts",
            method: "POST",
            description: "Write a post"
          },
          welcome: {
            href: "http://localhost:8080/welcome",
            rel: "Welcome-Page",
            method: "GET",
            description: "go back to welcome page"
          }
        }
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
