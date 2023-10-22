const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = require("./models");
db.sequelize.sync();

app.get("/", (req, res) => {
  res.send("API Services");
});

app.use(require("./routes"));

module.exports = app;
