const router = require("express").Router();

const userRoutes = require("./user");
const photoRoutes = require("./photo");

router.use("/users", userRoutes);
router.use("/photos", photoRoutes);

module.exports = router;
