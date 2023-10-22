const multer = require("multer");
const path = require("path");

const router = require("express").Router();
const photoController = require("../controllers/photo");
const authJWT = require("../middlewares/authJWT");

router.get("/", authJWT, photoController.findAll);
router.post("/", authJWT, photoController.create);
router.get("/:id", photoController.findById);

module.exports = router;
