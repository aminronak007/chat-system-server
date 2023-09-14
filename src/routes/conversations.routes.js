const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const ConversationController = require("../controllers/conversations.controller");

router.post("/create", verifyAccessToken, ConversationController.create);
router.get("/read", verifyAccessToken, ConversationController.read);
router.delete("/delete/:id", verifyAccessToken, ConversationController.delete);

router.get(
  "/get/:contact_id",
  verifyAccessToken,
  ConversationController.getConversationByContactId
);

// Routes for Channel or Group chats
router.get(
  "/read/channel",
  verifyAccessToken,
  ConversationController.getChannels
);

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
