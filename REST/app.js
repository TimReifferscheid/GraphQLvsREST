// third party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// internal paths
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts")
const config = require("./config.json");

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/users", userRoutes);
app.use("/posts", postRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

app.listen(3000);


app.use("/welcome", (req, res, next) => {
  res.status(200).json({
    message: "Welcome to Simple Network, please log in or signup",
    actions: {
      signup: {
        href: "http://localhost:8080/users",
        rel: "signup",
        method: "POST"
      },
      login: {
        href: "http://localhost:8080/users/login",
        rel: "login",
        method: "POST"
      },
      welcome: {
        href: "http://localhost:8080/welcome",
        rel: "self",
        method: "GET"
      }
    }
  });
});

app.use((req, res, next) => {
  res.status(404).send("404 Not found");
});

mongoose
  .connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(app.listen(8080), console.log("DB connected"))
  .catch(err => console.log("connection failed with error: " + err));
