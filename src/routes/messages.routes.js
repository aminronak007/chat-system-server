const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const MessagesController = require("../controllers/messages.controller");

router.post("/create", verifyAccessToken, MessagesController.create);
router.get("/read/:id", verifyAccessToken, MessagesController.read);
router.delete("/delete", verifyAccessToken, MessagesController.delete);

module.exports = router;
