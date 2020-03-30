const jwt = require("jsonwebtoken");
const config = require("./../config.json");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("not authenticated!");
    error.statuscode = 401;
    throw error;
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, config.secretKey);
  } catch (err) {
    err.statuscode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("not authenticated!");
    error.statuscode = 401;
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
};
