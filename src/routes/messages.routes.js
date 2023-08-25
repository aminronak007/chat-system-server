const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const MessagesController = require("../controllers/messages.controller");
const { upload } = require("../middlewares/multer");

router.post(
  "/create",
  verifyAccessToken,
  upload.fields([{ name: "file" }]),
  MessagesController.create
);
router.get(
  "/read/:id/:page/:limit",
  verifyAccessToken,
  MessagesController.read
);
router.post("/delete", verifyAccessToken, MessagesController.delete);

module.exports = router;
