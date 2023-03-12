const router = require("express").Router();
const AuthController = require("../controllers/auth.controller");
const { verifyAccessToken } = require("../middlewares/jwt");

router.post("/login", AuthController.login);
router.get("/logout", verifyAccessToken, AuthController.logout);
router.get("/check", verifyAccessToken, AuthController.checkUser);

module.exports = router;
