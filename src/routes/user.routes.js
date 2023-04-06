const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../middlewares/jwt");

router.get("/:search", verifyAccessToken, UserController.searchUser);

module.exports = router;
