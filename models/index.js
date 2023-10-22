require("dotenv").config();
const Sequelize = require("sequelize");

const db = {};
const env = process.env.NODE_ENV || "development";

let sequelize;
if (env == "test") {
  sequelize = new Sequelize(
    process.env.TEST_DB_NAME,
    process.env.TEST_DB_USER,
    process.env.TEST_DB_PASS,
    {
      host: process.env.TEST_DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
} else if (env == "development") {
  sequelize = new Sequelize(
    process.env.DEVELOPMENT_DB_NAME,
    process.env.DEVELOPMENT_DB_USER,
    process.env.DEVELOPMENT_DB_PASS,
    {
      host: process.env.DEVELOPMENT_DB_HOST,
      dialect: "mysql",
      logging: false,
    }
  );
}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user")(sequelize, Sequelize.DataTypes);
db.photo = require("./photo")(sequelize, Sequelize.DataTypes);

module.exports = db;
