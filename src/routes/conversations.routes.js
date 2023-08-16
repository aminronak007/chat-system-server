const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const ConversationController = require("../controllers/convesations.controller");

router.post("/create", verifyAccessToken, ConversationController.create);
router.get("/read", verifyAccessToken, ConversationController.read);
router.delete("/delete", verifyAccessToken, ConversationController.delete);

router.get(
  "/get/:contact_id",
  verifyAccessToken,
  ConversationController.getConversationByContactId
);

// Routes for Channel or Group chats
router.post(
  "/create/channel",
  verifyAccessToken,
  ConversationController.createChannel
);
router.put(
  "/update/channel",
  verifyAccessToken,
  ConversationController.updateChannel
);

module.exports = router;
