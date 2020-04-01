const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const User = require("./../models/user");
const Post = require("./../models/post");
const config = require("./../config.json");

exports.signUp = ({ userInput }, req) => {
  const errors = [];
  if (!validator.isEmail(userInput.email)) {
    errors.push({ message: "Email Adress is not valid!" });
  }
  if (
    validator.isEmpty(userInput.password) ||
    !validator.isLength(userInput.password, { min: 8 })
  ) {
    errors.push({ message: "Password is to short!" });
  }
  if (errors.length > 0) {
    const error = new Error("invalid input");
    error.data = errors; //add field assign errors array
    error.code = 422;
    throw error;
  }
  return User.findOne({ email: userInput.email }).then(user => {
    if (user) {
      const error = new Error("User exists already!");
      throw error;
    } else {
      return bcrypt
        .hash(userInput.password, 12)
        .then(hashedPW => {
          const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPW,
            posts: []
          });
          return user.save();
        })
        .then(createdUser => {
          return { ...createdUser._doc, _id: createdUser._id.toString() };
        })
        .catch(error => {
          if (!error.statusCode) {
            error.data = errors; //add field assign errors array
            error.code = 500;
          }
        });
    }
  });
};

exports.login = ({ email, password }, req) => {
  return User.findOne({ email: email }).then(user => {
    if (!user) {
      const error = new Error("user not found!");
      error.code = 401;
      throw error;
    }
    if (bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString()
        },
        config.secretKey,
        { expiresIn: "1h" }
      );
      return {
        token: token,
        userId: user._id.toString(),
        message: "login succesful!"
      };
    }
    const error = new Error("Wrong password!");
    error.code = 401;
    throw error;
  });
};

exports.createPost = ({ postInput }, req) => {
  if (!req.isAuth) {
    const error = new Error("not authenticated");
    error.code = 401;
    throw error;
  }
  const errors = [];
  return User.findById(req.userId).then(user => {
    if (!user) {
      const error = new Error("User not found!");
      error.statusCode = 401;
      throw error;
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      creator: { _id: req.userId, name: user.name } //reference to the user
    });
    return post
      .save()
      .then(result => {
        return User.findById(req.userId).then(user => ({
          user: user,
          createdPost: result
        }));
      })
      .then(({ user, createdPost }) => {
        //console.log(user);
        user.posts.push(createdPost);
        return user.save().then(result => ({
          result: result,
          createdPost
        }));
      })
      .then(({ result, createdPost }) => {
        return {
          ...post._doc,
          _id: createdPost._id.toString(),
          createdAt: createdPost.createdAt.toISOString(),
          updatedAt: createdPost.updatedAt.toISOString()
        };
      });
  });
};

exports.post = ({ id }, req) => {
  return Post.findById(id).then(post => {
    if (!post) {
      const error = new Error("not found");
      error.statusCode = 404;
      throw error;
    }
    return {
      ...post._doc
    };
  });
};

exports.updatePost = ({ id, postInput }, req) => {
  const title = postInput.title;
  const content = postInput.content;
  return Post.findById(id)
    .then(post => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      post.title = title;
      post.content = content;
      post.updatedAt = Date.now();
      return post.save();
    })
    .then(result => {
      return {
        ...result._doc
      };
    });
};

exports.deletePost = ({ id }, req) => {
  return Post.findById(id)
    .then(post => {
      if (!post) {
        const error = new Error("not found");
        error.statusCode = 404;
        throw error;
      }
      return Post.findByIdAndRemove(id);
    })
    .then(result => {
      return true;
    });
};

exports.posts = ({}, req) => {
  if (!req.isAuth) {
    const error = new Error("not authenticated");
    error.code = 401;
    throw error;
  }

  return Post.find();
};
