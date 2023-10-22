const router = require("express").Router();
const userController = require("../controllers/user");

router.get("/", userController.findAll);
router.post("/", userController.create);
router.post("/login", userController.login);

module.exports = router;
