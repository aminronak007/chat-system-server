const router = require("express").Router();
const UserController = require("../controllers/user.controller");
const { verifyAccessToken } = require("../middlewares/jwt");
const { upload } = require("../middlewares/multer");

router.get("/all", verifyAccessToken, UserController.getUsers);
router.get("/:id", verifyAccessToken, UserController.getUserById);
router.put(
  "/edit/:id",
  verifyAccessToken,
  upload.single("profile"),
  UserController.editUser
);
router.delete("/delete/:id", verifyAccessToken, UserController.deleteUser);
router.get("/search/:keyword", verifyAccessToken, UserController.searchUser);
router.put(
  "/last-conversation-id/update",
  verifyAccessToken,
  UserController.lastConversationId
);

module.exports = router;
