const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../middlewares/jwt");

router.get("/all", verifyAccessToken, UserController.getUsers);
router.get("/:id", verifyAccessToken, UserController.getUserById);
router.get("/edit/:id", verifyAccessToken, UserController.editUser);
router.get("/delete/:id", verifyAccessToken, UserController.deleteUser);
router.get("/:search", verifyAccessToken, UserController.searchUser);

module.exports = router;
