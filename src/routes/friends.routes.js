const router = require("express").Router();
const { verifyAccessToken } = require("../middlewares/jwt");
const FriendController = require("../controllers/friends.controller");

router.get("/get", verifyAccessToken, FriendController.getContacts);
router.post("/create", verifyAccessToken, FriendController.create);

module.exports = router;
