// 3rd party packages
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const graphqlHTTP = require("express-graphql");

// filepaths
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolver");
const auth = require("./middleware/is-auth");
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
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    formatError(err) {
      if (!err.originalError) {
        return err;
      }
      const data = err.originalError.data;
      const message = err.message || "an error occured!";
      const code = err.originalError.code || 500;
      return {
        message: message,
        status: code,
        data: data
      };
    }
  })
);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log("connected!");
    app.listen(8080);
  })
  .catch(err => console.log(err));
