// third party packages
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res, next) => {
  console.log("Tests");
});

app.listen(8080);
