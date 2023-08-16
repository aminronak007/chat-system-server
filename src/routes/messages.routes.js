const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const MessagesController = require("../controllers/messages.controller");
const { upload } = require("../middlewares/multer");

router.post(
  "/create",
  upload.single("file"),
  verifyAccessToken,
  MessagesController.create
);
router.get(
  "/read/:id/:page/:limit",
  verifyAccessToken,
  MessagesController.read
);
router.delete("/delete", verifyAccessToken, MessagesController.delete);

module.exports = router;
