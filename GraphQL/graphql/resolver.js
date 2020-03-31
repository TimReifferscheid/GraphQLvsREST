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
  User.findOne({ email: userInput.email }).then(user => {
    if (user) {
      const error = new Error("User exists already!");
      throw error;
    } else {
      bcrypt
        .hash(userInput.password, 12)
        .then(hashedPW => {
          const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPW
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
          next(err);
        });
    }
  });
};

// exports.login = ({ email, password }, req) => {
//   User.findOne({ email: email })
//     .then(user => {
//       if (!user) {
//         const error = new Error("user not found!");
//         error.code = 401;
//         throw error;
//       } else {
//         bcrypt.compare(password, User.password);
//         if (!isEqual) {
//           const error = new Error("Wrong password!");
//           error.code = 401;
//           throw error;
//         }
//         const token = jwt.sign(
//           {
//             email: user.email,
//             userId: user._id.toString()
//           },
//           config.secretKey,
//           { expiresIn: "1h" }
//         );
//         return {
//           token: token,
//           userId: user._id.toString(),
//           message: "login succesful!"
//         };
//       }
//     })
//     .catch(error => {
//       if (!error.statusCode) {
//         error.data = errors; //add field assign errors array
//         error.code = 500;
//       }
//       next(err);
//     });
// };

// module.createPost = ({ postInput }, req) => {
//   if (!req.isAuth) {
//     const error = new Error("not authenticated");
//     error.code = 401;
//     throw error;
//   }
//   const errors = [];
//   User.findById(req.userId).then(user => {
//     if (!user) {
//       const error = new Error("User not found!");
//       error.statusCode = 401;
//       throw error;
//     }

//     const post = new Post({
//       title: postInput.title,
//       content: postInput.content,
//       creator: { _id: req.userId, name: user.name } //reference to the user
//     });
//     post
//       .save()
//       .then(result => {
//         return User.findById(req.userId);
//       })
//       .then(user => {
//         creator = user;
//         user.posts.push(post);
//         return user.save();
//       })
//       .catch(error => {
//         if (!error.statusCode) {
//           error.data = errors; //add field assign errors array
//           error.code = 500;
//         }
//         next(err);
//       });
//     return {
//       ...createdPost._doc,
//       _id: createdPost._id.toString(),
//       createdAt: createdPost.createdAt.toISOString(),
//       updatedAt: createdPost.updatedAt.toISOString()
//     };
//   });
// };
